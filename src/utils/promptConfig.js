// ── UX Audit Prompt Configuration ────────────────────────────────────────────
// Centralises all prompt-related configuration for easy maintenance.

export const GROQ_MODEL = 'llama-3.3-70b-versatile';

export const UX_CATEGORIES = [
    { key: 'visual_design',            label: 'Visual Design',            icon: '🎨', desc: 'Colour palette, typography, spacing, branding consistency' },
    { key: 'accessibility',            label: 'Accessibility',            icon: '♿', desc: 'WCAG 2.2 compliance, colour contrast, keyboard nav, ARIA' },
    { key: 'performance_ux',           label: 'Performance (UX)',          icon: '⚡', desc: 'Perceived speed, LCP signals, spinners, skeleton screens' },
    { key: 'navigation_usability',     label: 'Navigation & Usability',   icon: '🧭', desc: 'Menu clarity, IA, breadcrumbs, task completion ease' },
    { key: 'mobile_responsiveness',    label: 'Mobile Responsiveness',    icon: '📱', desc: 'Fluid layout, touch targets, viewport adaptation' },
    { key: 'content_clarity',          label: 'Content Clarity',          icon: '📝', desc: 'Readability, CTA copy, hierarchy, information density' },
    { key: 'interaction_feedback',     label: 'Interaction & Feedback',   icon: '🖱️', desc: 'Hover states, loading indicators, error messages, micro-animations' },
];

export const SYSTEM_PROMPT =
    'You are an expert UX analyst with 15+ years of experience. ' +
    'Respond ONLY with valid JSON — no markdown fences, no explanation outside the JSON object. ' +
    'Your analysis must be evidence-based, specific, and immediately actionable.';

/**
 * Builds the full user prompt sent to the LLM.
 * @param {string} url - Normalised website URL
 * @param {string} websiteType - e.g. "E-commerce / Online Store"
 * @param {string} industry - e.g. "Fintech" (optional)
 * @param {object} htmlSignals - Extracted signals from the page HTML
 */
export const buildAuditPrompt = (url, websiteType, industry, htmlSignals) => {
    const signalBlock = htmlSignals
        ? `
## Extracted Page Signals (live HTML analysis)
- Page title: ${htmlSignals.title || 'Not found'}
- Meta description: ${htmlSignals.metaDescription || 'Missing'}
- H1 tags: ${htmlSignals.h1s?.join(', ') || 'None detected'}
- H2 tags (first 5): ${htmlSignals.h2s?.slice(0, 5).join(', ') || 'None detected'}
- Total links: ${htmlSignals.linkCount ?? 'Unknown'}
- Total images: ${htmlSignals.imgCount ?? 'Unknown'}
- Images missing alt: ${htmlSignals.imgsMissingAlt ?? 'Unknown'}
- Form count: ${htmlSignals.formCount ?? 'Unknown'}
- Has viewport meta tag: ${htmlSignals.hasViewport ? 'Yes' : 'No'}
- Has aria-label attributes: ${htmlSignals.hasAria ? 'Yes' : 'No'}
- Has skip-navigation link: ${htmlSignals.hasSkipNav ? 'Yes' : 'No'}
- Detected frameworks/tech: ${htmlSignals.detectedTech?.join(', ') || 'Unknown'}
- Approximate word count: ${htmlSignals.wordCount ?? 'Unknown'}
`
        : '\n## Page Signals\nCould not extract live signals — base analysis on known characteristics of this URL and website type.\n';

    return `You are performing a comprehensive UX audit.

## Target Website
- URL: ${url}
- Website Type: ${websiteType}
- Industry / Niche: ${industry || 'General'}
${signalBlock}

## Your Task
Evaluate this website across ALL 7 UX dimensions below. Score each 0–100 (be strict — 90+ means near-perfect).

1. **Visual Design** — Colour palette, typography, spacing, branding consistency
2. **Accessibility** — WCAG 2.2 compliance, contrast ratios, keyboard navigation, ARIA roles
3. **Performance (UX)** — Perceived speed, LCP signals, loading states, skeleton screens
4. **Navigation & Usability** — Menu clarity, information architecture, breadcrumbs, task completion
5. **Mobile Responsiveness** — Fluid layouts, touch target sizes, viewport adaptation
6. **Content Clarity** — Readability, CTA copy quality, heading hierarchy, information density
7. **Interaction & Feedback** — Hover states, error messages, loading indicators, micro-animations

## Rules
- Use the extracted page signals as primary evidence where available
- Cite specific observations (e.g. "H1 is missing", "no alt text on ${htmlSignals?.imgsMissingAlt ?? 0} images")
- Provide 5 to 7 issues and 5 to 7 suggestions covering the categories
- Keep each description concise and punchy (15-30 words max per description) so the output JSON remains complete and never gets cut off mid-sentence
- All suggestions must be immediately actionable with concrete steps
- Return ONLY valid JSON — no markdown fences, no text outside the JSON

## Required JSON Structure
{
  "score": <integer 0-100, weighted average of all 7 categories>,
  "summary": "<2-3 sentence executive summary of overall UX quality and most critical finding>",
  "category_scores": {
    "visual_design": <integer 0-100>,
    "accessibility": <integer 0-100>,
    "performance_ux": <integer 0-100>,
    "navigation_usability": <integer 0-100>,
    "mobile_responsiveness": <integer 0-100>,
    "content_clarity": <integer 0-100>,
    "interaction_feedback": <integer 0-100>
  },
  "issues": [
    {
      "severity": "High" | "Medium" | "Low",
      "category": "<one of the 7 category labels>",
      "title": "<short descriptive title>",
      "description": "<specific description citing page evidence>"
    }
  ],
  "suggestions": [
    {
      "priority": "Quick Win" | "Strategic" | "Long-term",
      "category": "<one of the 7 category labels>",
      "title": "<short actionable title>",
      "description": "<step-by-step implementation guidance>"
    }
  ],
  "strengths": [
    "<specific strength with evidence from page signals>",
    "<another specific strength>"
  ]
}`;
};
