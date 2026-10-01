import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import Loader from './components/Loader';
import ResultDisplay from './components/ResultDisplay';
import Footer from './components/Footer';
import { analyzeWebsiteUX } from './utils/groqApi';

export default function App() {
  const [state, setState] = useState('idle'); // 'idle' | 'loading' | 'result' | 'error'
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({ url: '', websiteType: '' });

  const handleAnalyze = async (url, websiteType, industry) => {
    setState('loading');
    setError(null);
    setMeta({ url, websiteType });

    try {
      const data = await analyzeWebsiteUX(url, websiteType, industry);
      setResult(data);
      setState('result');
      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error(err);
      setError(err?.message ?? 'An unexpected error occurred.');
      setState('error');
    }
  };

  const handleReset = () => {
    setState('idle');
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background ambient orbs */}
      <div className="orb w-[600px] h-[600px] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
        style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
      <div className="orb w-96 h-96 top-1/3 -right-48 opacity-8"
        style={{ background: 'radial-gradient(circle, #fb923c, transparent)' }} />
      <div className="orb w-96 h-96 bottom-0 -left-48 opacity-8"
        style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />

      <Header />

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16">

        {/* ── Error Banner ───────────────────────────────── */}
        {state === 'error' && error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 flex items-start gap-3 section-enter">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                  stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-400 mb-1">Audit Failed</p>
              <p className="text-sm text-red-300/80 leading-relaxed whitespace-pre-line">{error}</p>
            </div>
            <button onClick={() => { setError(null); setState('idle'); }}
              className="text-red-400/60 hover:text-red-400 transition-colors p-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {/* ── Input Form ─────────────────────────────────── */}
        {(state === 'idle' || state === 'error') && (
          <InputForm onAnalyze={handleAnalyze} isLoading={false} />
        )}

        {/* ── Loading ────────────────────────────────────── */}
        {state === 'loading' && (
          <Loader
            url={meta.url}
            provider={
              (import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY)?.startsWith('AIzaSy')
                ? 'Gemini 2.5 Flash'
                : 'Groq Llama 3.3 70B'
            }
          />
        )}

        {/* ── Results ───────────────────────────────────── */}
        {state === 'result' && result && (
          <ResultDisplay
            result={result}
            url={meta.url}
            websiteType={meta.websiteType}
            onReset={handleReset}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
