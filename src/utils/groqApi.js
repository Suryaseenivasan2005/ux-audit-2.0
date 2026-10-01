import axios from 'axios';
import { GROQ_MODEL, UX_CATEGORIES, SYSTEM_PROMPT, buildAuditPrompt } from './promptConfig';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const ALLORIGINS_URL = 'https://api.allorigins.win/get?url=';

// ── URL normalisation & validation ──────────────────────────────────────────
export const normaliseUrl = (raw) => {
    const t = raw.trim();
    if (!t) return '';
    return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

export const isLikelyValidDomain = (raw) => {
    if (!raw.trim()) return false;
    const normalized = normaliseUrl(raw);
    try {
        const { hostname } = new URL(normalized);
        return /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,20}$/i.test(hostname);
    } catch {
        return false;
    }
};

// ── HTML Signal Extractor (via allorigins proxy) ─────────────────────────────
export const extractHtmlSignals = async (url) => {
    try {
        const proxyUrl = `${ALLORIGINS_URL}${encodeURIComponent(url)}`;
        const res = await axios.get(proxyUrl, { timeout: 10000 });
        const html = res.data?.contents ?? '';

        if (!html) return null;

        // Parse with DOMParser in the browser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const title = doc.querySelector('title')?.textContent?.trim() || '';
        const metaDesc = doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() || '';
        const h1s = Array.from(doc.querySelectorAll('h1')).map(el => el.textContent.trim()).filter(Boolean).slice(0, 5);
        const h2s = Array.from(doc.querySelectorAll('h2')).map(el => el.textContent.trim()).filter(Boolean).slice(0, 8);
        const allLinks = doc.querySelectorAll('a[href]');
        const allImages = doc.querySelectorAll('img');
        const imgsMissingAlt = Array.from(allImages).filter(img => !img.getAttribute('alt')).length;
        const allForms = doc.querySelectorAll('form');
        const hasViewport = !!doc.querySelector('meta[name="viewport"]');
        const hasAria = doc.body?.innerHTML?.includes('aria-label') || false;
        const hasSkipNav = !!doc.querySelector('a[href="#main"], a[href="#content"], .skip-nav, .skip-link');

        // Detect common frameworks from script srcs and class names
        const scripts = Array.from(doc.querySelectorAll('script[src]')).map(s => s.getAttribute('src') || '');
        const tech = [];
        if (scripts.some(s => s.includes('react'))) tech.push('React');
        if (scripts.some(s => s.includes('vue'))) tech.push('Vue');
        if (scripts.some(s => s.includes('angular'))) tech.push('Angular');
        if (scripts.some(s => s.includes('next'))) tech.push('Next.js');
        if (html.includes('wp-content') || html.includes('wordpress')) tech.push('WordPress');
        if (html.includes('shopify')) tech.push('Shopify');

        // Approximate word count from body text
        const bodyText = doc.body?.innerText || doc.body?.textContent || '';
        const wordCount = bodyText.trim().split(/\s+/).filter(Boolean).length;

        return {
            title,
            metaDescription: metaDesc,
            h1s,
            h2s,
            linkCount: allLinks.length,
            imgCount: allImages.length,
            imgsMissingAlt,
            formCount: allForms.length,
            hasViewport,
            hasAria,
            hasSkipNav,
            detectedTech: tech,
            wordCount,
        };
    } catch (err) {
        console.warn('[extractHtmlSignals] Could not fetch page via proxy:', err.message);
        return null; // Graceful degradation — LLM will use URL-based reasoning
    }
};

// ── Response parser ──────────────────────────────────────────────────────────
const parseGroqResponse = (rawText, url) => {
    const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    try {
        const parsed = JSON.parse(cleaned);

        // Build category_scores from the 7 required keys
        const catScores = {};
        for (const cat of UX_CATEGORIES) {
            const val = parsed.category_scores?.[cat.key];
            catScores[cat.key] = typeof val === 'number' ? Math.min(100, Math.max(0, val)) : null;
        }

        // Compute weighted overall score as average of available category scores
        const validScores = Object.values(catScores).filter(v => v !== null);
        const computedScore = validScores.length
            ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length)
            : null;

        return {
            score: typeof parsed.score === 'number'
                ? Math.min(100, Math.max(0, parsed.score))
                : computedScore,
            summary: parsed.summary || `UX analysis of ${url} completed.`,
            category_scores: catScores,
            issues: Array.isArray(parsed.issues) ? parsed.issues : [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        };
    } catch {
        // JSON parse failed — return raw text as fallback
        return {
            score: null,
            summary: rawText,
            category_scores: null,
            issues: [],
            suggestions: [],
            strengths: [],
            _raw: true,
        };
    }
};

// ── Friendly error translator ─────────────────────────────────────────────────
const translateGroqError = (axiosErr) => {
    const status = axiosErr?.response?.status;
    const groqMsg = axiosErr?.response?.data?.error?.message ?? '';

    if (status === 401) {
        return (
            '401 — Invalid API Key.\n\n' +
            'Your Groq key was rejected. Steps to fix:\n' +
            '1. Go to https://console.groq.com/keys\n' +
            '2. Create a new API key (starts with gsk_)\n' +
            '3. Paste it in .env as VITE_GROQ_API_KEY=gsk_...\n' +
            '4. Restart Vite (Ctrl+C then npm run dev)'
        );
    }
    if (status === 429) {
        return '429 — Rate Limit. Too many requests.\nWait 10–30 seconds and try again.\n(Free tier: ~30 req/min on llama3-70b-8192)';
    }
    if (status === 503) {
        return '503 — Groq server temporarily unavailable. Please retry in a moment.';
    }
    if (status === 500) {
        return '500 — Groq internal server error. Please try again.';
    }
    return groqMsg
        ? `Groq API error: ${groqMsg}`
        : `Request failed (HTTP ${status ?? 'unknown'}). Check your network and API key, then try again.`;
};

// ── Main export: Full automated UX audit ────────────────────────────────────
export const analyzeWebsiteUX = async (url, websiteType, industry) => {
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiKey = groqKey || geminiKey;

    const isGemini = apiKey?.startsWith('AIzaSy');
    const isGroq = apiKey?.startsWith('gsk_');

    if (!apiKey || (!isGemini && !isGroq)) {
        throw new Error(
            'API key is missing or invalid.\n\n' +
            'Open your .env file and set one of the following:\n' +
            '• VITE_GROQ_API_KEY=gsk_your_groq_key (from https://console.groq.com/)\n' +
            '• VITE_GEMINI_API_KEY=AIzaSy_your_gemini_key (from https://aistudio.google.com/)'
        );
    }

    // Step 1: Extract live HTML signals (best-effort via allorigins)
    const htmlSignals = await extractHtmlSignals(url);

    // Step 2: Build the full audit prompt with signals
    const prompt = buildAuditPrompt(url, websiteType, industry, htmlSignals);

    let rawText = '';

    if (isGemini) {
        // Step 3a: Call Google Gemini API (gemini-2.5-flash)
        try {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            const response = await axios.post(
                geminiUrl,
                {
                    contents: [
                        {
                            parts: [
                                { text: `${SYSTEM_PROMPT}\n\n${prompt}` }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 4096
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    timeout: 60000
                }
            );
            rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (axiosErr) {
            const msg = axiosErr?.response?.data?.error?.message ?? axiosErr?.message;
            throw new Error(`Gemini API Error: ${msg}`);
        }
    } else {
        // Step 3b: Call Groq API
        const requestBody = {
            model: GROQ_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: prompt },
            ],
            temperature: 0.3,
            max_tokens: 4096,
            top_p: 1,
            stream: false,
        };

        let response;
        try {
            response = await axios.post(GROQ_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                timeout: 60000,
            });
        } catch (axiosErr) {
            throw new Error(translateGroqError(axiosErr));
        }

        rawText = response.data?.choices?.[0]?.message?.content ?? '';
    }

    // Step 4: Parse and return structured result
    return parseGroqResponse(rawText, url);
};
