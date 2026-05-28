# UX Audit 2.0

A React + Vite app that performs automated user experience audits for websites using the Groq API. Enter a URL, choose the website type, and receive a structured UX review across 7 key categories.

## Features

- Submit any website URL and choose the website type
- Fetches live HTML signals via a proxy to enrich UX analysis
- Uses the Groq `llama-3.3-70b-versatile` model to generate actionable UX findings
- Presents category scores, issues, suggestions, and strengths
- Smooth error handling for invalid input, API failures, and proxy limitations

## Built With

- React 19
- Vite
- Tailwind CSS
- Axios
- Groq API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Groq API key (`gsk_...`)

### Installation

1. Clone the repository or open this folder in your editor.
2. Install dependencies:

```bash
npm install
```

### Environment

Create a `.env` file in the project root with:

```env
VITE_GROQ_API_KEY=gsk_your_real_key_here
```

### Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Usage

1. Enter a website URL in the input field.
2. Choose the website type from the dropdown.
3. Optionally provide an industry or niche.
4. Click `Analyze`.
5. View the generated UX audit report, including:
   - overall score
   - category scores
   - issues
   - suggestions
   - strengths

## Available Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build the production bundle
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the project

## Project Structure

- `src/App.jsx` — Main application logic and state management
- `src/components` — UI components
- `src/utils/groqApi.js` — Groq API integration, URL validation, HTML signal extraction, response parsing
- `src/utils/promptConfig.js` — UX audit prompt and scoring configuration

## Notes

- The app uses `https://api.allorigins.win/get?url=` to fetch website HTML from the browser. If that proxy is unavailable, the audit still runs using URL-based analysis.
- Make sure your Groq API key is valid and starts with `gsk_`.

## License

This project is provided as-is.
