import axios from 'axios';

const GEMINI_API_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Converts a File object to a base64-encoded string (without the data: prefix).
 */
const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // result is like "data:image/png;base64,XXXX" — we need only the XXXX part
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

/**
 * Builds human-readable prompt text from user inputs.
 */
const buildPrompt = (url, testType) => {
    // testType may be a combined label like "Accessibility Test + Usability Test"
    const types = testType.split('+').map(t => t.trim()).filter(Boolean);
    const isMulti = types.length > 1;

    const typesList = types.map((t, i) => `  ${i + 1}. **${t}**`).join('\n');
    const coverageNote = isMulti
        ? `You must cover ALL of the following analysis dimensions in your response:\n${typesList}\nFor each issue and suggestion, tag it with the most relevant analysis type in the "category" field.`
        : `Perform a thorough **${types[0]}**.`;

    return `
You are an expert UX analyst and web design consultant. Analyze the UX of the website shown in the screenshot below.

**Website URL:** ${url}
**Requested Analysis:** ${testType}

${coverageNote}

Structure your response in the following exact JSON format (respond with ONLY valid JSON, no markdown code fences):

{
  "summary": "A concise 2-3 sentence executive summary of the overall UX quality, covering every requested analysis dimension.",
  "score": <integer from 0 to 100 representing overall UX score>,
  "issues": [
    {
      "severity": "High | Medium | Low",
      "category": "Category name (e.g. Accessibility, Navigation, Visual Hierarchy, Usability)",
      "title": "Short issue title",
      "description": "Detailed description of the issue and why it matters."
    }
  ],
  "suggestions": [
    {
      "priority": "Quick Win | Strategic | Long-term",
      "title": "Short suggestion title",
      "description": "Actionable improvement suggestion with specific steps."
    }
  ],
  "strengths": [
    "Strength 1",
    "Strength 2"
  ]
}

Be specific, actionable, and base your analysis strictly on what is visible in the screenshot.
`.trim();
};

/**
 * Sends a UX analysis request to the Gemini API.
 * @param {string} url          – Website URL entered by the user
 * @param {File}   screenshotFile – Screenshot File object (PNG/JPG)
 * @param {string} testType     – Selected UX test type label
 * @returns {Promise<object>}   – Parsed JSON response from Gemini
 */
export const analyzeUX = async (url, screenshotFile, testType) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error(
            'Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file.'
        );
    }

    const base64Image = await fileToBase64(screenshotFile);
    const mimeType = screenshotFile.type || 'image/png';

    const requestBody = {
        contents: [
            {
                parts: [
                    { text: buildPrompt(url, testType) },
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Image,
                        },
                    },
                ],
            },
        ],
        generationConfig: {
            temperature: 0.4,
            topK: 32,
            topP: 1,
            maxOutputTokens: 4096,
        },
    };

    const response = await axios.post(
        `${GEMINI_API_URL}?key=${apiKey}`,
        requestBody,
        { headers: { 'Content-Type': 'application/json' } }
    );

    const rawText =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip any accidental markdown code fences Gemini might add
    const cleaned = rawText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch {
        // Return a graceful fallback so the UI can still display something
        return {
            summary: rawText,
            score: null,
            issues: [],
            suggestions: [],
            strengths: [],
            _raw: true,
        };
    }
};
