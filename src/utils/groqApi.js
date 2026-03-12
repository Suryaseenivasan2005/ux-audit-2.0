import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ── URL normalisation & validation ──────────────────────────────
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
        // Must look like domain.tld — no spaces, at least one dot, valid TLD (2-20 chars)
        return /^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,20}$/i.test(hostname);
    } catch {
        return false;
    }
};

// ── Prompt builder ───────────────────────────────────────────────
const buildPrompt = (url, testType, websiteType, industry) => {
    const types = testType.split('+').map(t => t.trim()).filter(Boolean);
    const typeList = types.map((t, i) => `${i + 1}. ${t}`).join('\n');

    return `You are a world-class UX analyst and web design consultant with 15+ years of experience.

Analyze the user experience of this website:

Website URL: ${url}
Website Type: ${websiteType}
Industry / Niche: ${industry || 'General'}
Analysis Requested: ${testType}

${types.length > 1 ? `Perform a COMBINED analysis covering ALL of these dimensions:\n${typeList}` : `Perform a thorough ${types[0]}.`}

Evaluate the website rigorously across these 5 dimensions and score each 0-100:
- Usability: Ease of use, task completion, learnability, error prevention
- Navigation: Menu clarity, information architecture, wayfinding, breadcrumbs
- Accessibility: WCAG 2.2 compliance, contrast, keyboard nav, screen reader support
- Visual Hierarchy: Typography, spacing, focal points, CTA prominence, colour usage
- Layout Consistency: Grid alignment, component patterns, responsive design, spacing system

CRITICAL INSTRUCTIONS:
1. Base your analysis on widely known characteristics of ${url} and ${websiteType} best practices
2. Be highly specific — mention actual UI patterns typical of ${websiteType} sites in the ${industry || 'general'} industry
3. Provide MINIMUM 6 issues and 6 suggestions
4. Make suggestions immediately actionable with specific implementation steps
5. Return ONLY valid JSON. NO markdown fences. NO explanation text outside the JSON.

Return this EXACT JSON structure:
{
  "score": <integer 0-100>,
  "summary": "<2-3 sentence executive summary covering overall UX quality and critical findings>",
  "category_scores": {
    "usability": <integer 0-100>,
    "navigation": <integer 0-100>,
    "accessibility": <integer 0-100>,
    "visual_hierarchy": <integer 0-100>,
    "layout_consistency": <integer 0-100>
  },
  "issues": [
    {
      "severity": "High",
      "category": "Accessibility",
      "title": "Short descriptive title",
      "description": "Specific, detailed description referencing real UX patterns on this type of site"
    }
  ],
  "suggestions": [
    {
      "priority": "Quick Win",
      "title": "Short actionable title",
      "description": "Step-by-step implementation guidance"
    }
  ],
  "strengths": [
    "Specific strength with context",
    "Another specific strength"
  ]
}`;
};

// ── Response parser ──────────────────────────────────────────────
const parseGroqResponse = (rawText, url) => {
    // Strip any accidental markdown fences Groq sometimes adds
    const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    try {
        const parsed = JSON.parse(cleaned);

        // Ensure all required fields exist with sane defaults
        return {
            score: typeof parsed.score === 'number'
                ? Math.min(100, Math.max(0, parsed.score)) : null,
            summary: parsed.summary || `UX analysis of ${url} completed.`,
            category_scores: {
                usability: parsed.category_scores?.usability ?? null,
                navigation: parsed.category_scores?.navigation ?? null,
                accessibility: parsed.category_scores?.accessibility ?? null,
                visual_hierarchy: parsed.category_scores?.visual_hierarchy ?? null,
                layout_consistency: parsed.category_scores?.layout_consistency ?? null,
            },
            issues: Array.isArray(parsed.issues) ? parsed.issues : [],
            suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
            strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        };
    } catch {
        // JSON parse failed — return raw text as fallback
        return {
            score: null, summary: rawText,
            category_scores: null,
            issues: [], suggestions: [], strengths: [], _raw: true,
        };
    }
};

// ── Friendly error translator ────────────────────────────────────
const translateGroqError = (axiosErr) => {
    const status = axiosErr?.response?.status;
    const groqMsg = axiosErr?.response?.data?.error?.message ?? '';

    if (status === 401) {
        return '401 — Invalid API Key.\n\nYour Groq key was rejected. Steps to fix:\n1. Go to https://console.groq.com/keys\n2. Create a new API key (starts with gsk_)\n3. Paste it in .env as VITE_GROQ_API_KEY=gsk_...\n4. Save — Vite restarts automatically.';
    }
    if (status === 429) {
        return '429 — Rate Limit. Too many requests.\nWait a few seconds and try again.\n(Free tier: ~30 req/min on Llama 3.3 70B)';
    }
    if (status === 500 || status === 503) {
        return `${status} — Groq server error. Please try again in a moment.`;
    }
    return groqMsg
        ? `Groq API error: ${groqMsg}`
        : `Request failed (HTTP ${status ?? 'unknown'}). Check your network and try again.`;
};

// ── Main export ──────────────────────────────────────────────────
export const analyzeWebsiteUX = async (url, testType, websiteType, industry) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey || !apiKey.startsWith('gsk_')) {
        throw new Error(
            'Groq API key is missing or invalid.\n\n'
            + 'Open your .env file and set:\nVITE_GROQ_API_KEY=gsk_your_real_key_here\n\n'
            + 'Get a free key at: https://console.groq.com/'
        );
    }

    const prompt = buildPrompt(url, testType, websiteType, industry);

    const requestBody = {
        model: GROQ_MODEL,
        messages: [
            {
                role: 'system',
                content: 'You are an expert UX analyst. Respond ONLY with valid JSON — no markdown, no explanation outside the JSON object.',
            },
            { role: 'user', content: prompt },
        ],
        temperature: 0.35,
        max_tokens: 4096,
        top_p: 1,
        stream: false,
    };

    let response;
    try {
        response = await axios.post(GROQ_API_URL, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
        });
    } catch (axiosErr) {
        throw new Error(translateGroqError(axiosErr));
    }

    const rawText = response.data?.choices?.[0]?.message?.content ?? '';
    return parseGroqResponse(rawText, url);
};
