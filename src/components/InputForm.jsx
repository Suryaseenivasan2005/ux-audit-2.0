import React, { useState } from 'react';
import { normaliseUrl, isLikelyValidDomain } from '../utils/groqApi';

const TEST_TYPES = [
    { value: 'Accessibility Test', emoji: '♿', desc: 'WCAG compliance & screen-reader support' },
    { value: 'Usability Test', emoji: '🧪', desc: 'Task flow & cognitive load evaluation' },
    { value: 'UI Design Evaluation', emoji: '🎨', desc: 'Visual hierarchy & design consistency' },
    { value: 'UX Heuristic Analysis', emoji: '📋', desc: "Nielsen's 10 usability heuristics" },
    { value: 'Full UX Audit', emoji: '🔍', desc: 'Comprehensive end-to-end UX audit' },
];

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
    const [selectedTests, setSelectedTests] = useState(new Set([TEST_TYPES[4].value]));
    const [errors, setErrors] = useState({});

    const toggleTest = (value) => {
        setSelectedTests((prev) => {
            const next = new Set(prev);
            if (next.has(value)) {
                if (next.size === 1) return next; // keep at least one
                next.delete(value);
            } else {
                next.add(value);
            }
            return next;
        });
    };

    const validate = () => {
        const errs = {};
        if (!rawUrl.trim()) {
            errs.url = 'Please enter a website URL or domain name.';
        } else if (!isLikelyValidDomain(rawUrl)) {
            errs.url = 'That doesn\'t look like a valid domain. Try: example.com or https://example.com';
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
            const testLabel = Array.from(selectedTests).join(' + ');
            onAnalyze(finalUrl, testLabel, websiteType, industry.trim());
        }
    };

    const isActive = (v) => selectedTests.has(v);

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
                    <h2 className="text-lg font-display font-600 text-white leading-tight">UX Analysis Setup</h2>
                    <p className="text-xs text-slate-500">Powered by Groq · Llama 3.3 70B</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-6">

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

                {/* ── Analysis Type — multiselect ─────────────────── */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-300">
                            Analysis Type
                            <span className="ml-2 text-xs text-slate-500 font-normal">— select one or more</span>
                        </label>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                            style={{
                                background: 'rgba(249,115,22,0.12)',
                                color: '#fb923c',
                                border: '1px solid rgba(249,115,22,0.3)',
                            }}>
                            {selectedTests.size} selected
                        </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                        {TEST_TYPES.map((type) => {
                            const active = isActive(type.value);
                            return (
                                <button
                                    key={type.value}
                                    type="button"
                                    id={`test-type-${type.value.replace(/\s+/g, '-').toLowerCase()}`}
                                    onClick={() => toggleTest(type.value)}
                                    className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 ${active
                                            ? 'border-orange-500/50 bg-orange-500/8 shadow-lg shadow-orange-500/10'
                                            : 'border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]'
                                        }`}
                                >
                                    <div className={`absolute top-2.5 right-2.5 w-4 h-4 rounded flex items-center justify-center border transition-all ${active ? 'border-orange-500 bg-orange-500' : 'border-white/20 bg-transparent'
                                        }`}>
                                        {active && (
                                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                                                <path d="M1.5 4.5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-xl leading-none mt-0.5">{type.emoji}</span>
                                    <div className="pr-5">
                                        <p className={`text-xs font-semibold leading-tight ${active ? 'text-orange-300' : 'text-slate-300'}`}>
                                            {type.value}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-tight">{type.desc}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Selected pills */}
                    {selectedTests.size > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {Array.from(selectedTests).map((t) => {
                                const type = TEST_TYPES.find(tt => tt.value === t);
                                return (
                                    <span key={t}
                                        className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                                        style={{
                                            background: 'rgba(249,115,22,0.1)',
                                            border: '1px solid rgba(249,115,22,0.25)',
                                            color: '#fb923c',
                                        }}>
                                        {type?.emoji} {t}
                                        <button
                                            type="button"
                                            onClick={() => toggleTest(t)}
                                            className="hover:text-red-400 transition-colors"
                                        >×</button>
                                    </span>
                                );
                            })}
                        </div>
                    )}
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
                            Analyze UX
                            {selectedTests.size > 1 && (
                                <span className="text-xs font-normal opacity-80">({selectedTests.size} tests)</span>
                            )}
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
