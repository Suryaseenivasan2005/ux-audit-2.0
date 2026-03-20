import React, { useState } from 'react';
import { normaliseUrl, isLikelyValidDomain } from '../utils/groqApi';

const WEBSITE_TYPES = [
    'E-commerce / Online Store',
    'SaaS / Web App',
    'Corporate / Business',
    'Portfolio / Personal',
    'Blog / Content Site',
    'News / Media',
    'Landing Page',
    'Healthcare / Medical',
    'Education / eLearning',
    'Non-profit / NGO',
    'Government / Public Sector',
    'Other',
];

export default function InputForm({ onAnalyze, isLoading }) {
    const [rawUrl, setRawUrl] = useState('');
    const [websiteType, setWebsiteType] = useState('');
    const [industry, setIndustry] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!rawUrl.trim()) {
            errs.url = 'Please enter a website URL or domain name.';
        } else if (!isLikelyValidDomain(rawUrl)) {
            errs.url = "That doesn't look like a valid domain. Try: example.com or https://example.com";
        }
        if (!websiteType) {
            errs.websiteType = 'Please select the website type.';
        }
        return errs;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length === 0) {
            const finalUrl = normaliseUrl(rawUrl);
            onAnalyze(finalUrl, websiteType, industry.trim());
        }
    };

    return (
        <div id="input-form-section" className="glass-card rounded-3xl p-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                        <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-lg font-display font-600 text-white leading-tight">Full UX Audit</h2>
                    <p className="text-xs text-slate-500">All 7 categories · Powered by Groq · Llama 3 70B</p>
                </div>
            </div>

            {/* Automated audit notice */}
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                <span className="text-lg">🤖</span>
                <div>
                    <p className="text-xs font-semibold text-indigo-300">Fully Automated — No configuration needed</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Audits Visual Design, Accessibility, Performance, Navigation, Mobile, Content &amp; Interaction
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">

                {/* ── Website URL ─────────────────────────────────── */}
                <div>
                    <label htmlFor="website-url" className="block text-sm font-medium text-slate-300 mb-2">
                        Website URL or Domain <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
                                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </div>
                        <input
                            id="website-url"
                            type="text"
                            value={rawUrl}
                            onChange={(e) => { setRawUrl(e.target.value); setErrors(p => ({ ...p, url: null })); }}
                            placeholder="stripe.com  or  https://airbnb.com"
                            className={`input-field w-full rounded-xl pl-10 pr-36 py-3 text-sm ${errors.url ? 'border-red-500/60' : ''}`}
                        />
                        {rawUrl.trim() && !errors.url && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs pointer-events-none"
                                style={{ color: isLikelyValidDomain(rawUrl) ? '#34d399' : '#fb923c' }}>
                                {isLikelyValidDomain(rawUrl) ? (
                                    <>
                                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                        Valid domain
                                    </>
                                ) : (
                                    <>⚠ Check URL</>
                                )}
                            </div>
                        )}
                    </div>
                    {errors.url && (
                        <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                            <span>⚠</span> {errors.url}
                        </p>
                    )}
                    <p className="text-xs text-slate-600 mt-1.5">
                        Accepts: <span className="text-slate-500">google.com · www.notion.so · https://figma.com/design</span>
                    </p>
                </div>

                {/* ── Website Type + Industry ─────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="website-type" className="block text-sm font-medium text-slate-300 mb-2">
                            Website Type <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <select
                                id="website-type"
                                value={websiteType}
                                onChange={(e) => { setWebsiteType(e.target.value); setErrors(p => ({ ...p, websiteType: null })); }}
                                className={`input-field w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer ${errors.websiteType ? 'border-red-500/60' : ''}`}
                            >
                                <option value="" disabled>Select type...</option>
                                {WEBSITE_TYPES.map(t => (
                                    <option key={t} value={t} className="bg-slate-900">{t}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                            </div>
                        </div>
                        {errors.websiteType && (
                            <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
                                <span>⚠</span> {errors.websiteType}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="industry" className="block text-sm font-medium text-slate-300 mb-2">
                            Industry / Niche
                            <span className="text-slate-600 font-normal ml-1">(optional)</span>
                        </label>
                        <input
                            id="industry"
                            type="text"
                            value={industry}
                            onChange={(e) => setIndustry(e.target.value)}
                            placeholder="e.g. Fintech, Healthcare, Fashion..."
                            className="input-field w-full rounded-xl px-4 py-3 text-sm"
                        />
                    </div>
                </div>

                {/* ── Audit categories preview ──────────────────── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                        { icon: '🎨', label: 'Visual Design' },
                        { icon: '♿', label: 'Accessibility' },
                        { icon: '⚡', label: 'Performance' },
                        { icon: '🧭', label: 'Navigation' },
                        { icon: '📱', label: 'Mobile' },
                        { icon: '📝', label: 'Content' },
                        { icon: '🖱️', label: 'Interaction' },
                        { icon: '📊', label: '7 Categories' },
                    ].map(({ icon, label }) => (
                        <div key={label}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                            <span className="text-sm">{icon}</span>
                            <span>{label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Submit ─────────────────────────────────────── */}
                <button
                    id="analyze-btn"
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full py-4 rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-3"
                    style={{ background: isLoading ? undefined : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #f59e0b 100%)' }}
                >
                    {isLoading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                                style={{ animation: 'spin 0.8s linear infinite' }} />
                            Analyzing...
                        </>
                    ) : (
                        <>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" strokeWidth="0.5" strokeLinejoin="round" />
                            </svg>
                            Run Full UX Audit
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
