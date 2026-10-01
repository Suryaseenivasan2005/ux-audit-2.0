import React, { useState } from 'react';

const ShieldIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7V12C3 16.5 7 20.7 12 22C17 20.7 21 16.5 21 12V7L12 2Z" fill="url(#heroShieldGrad)" />
        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="heroShieldGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
        </defs>
    </svg>
);

const DEMO_CATEGORIES = [
    {
        id: 'visual',
        label: 'Visual Design',
        icon: '🎨',
        score: 84,
        issue: 'Low Contrast on Primary CTA',
        desc: 'Button background color (#f97316) against white text lacks contrast ratio of 4.5:1 under WCAG AA.',
        fix: 'Increase contrast ratio by changing text color to #ffffff or darkening button fill to #ea580c.'
    },
    {
        id: 'a11y',
        label: 'Accessibility',
        icon: '♿',
        score: 72,
        issue: 'Missing Alt Text on 4 Hero Images',
        desc: 'Screen reader users receive no descriptive context for product visual assets.',
        fix: 'Add descriptive alt="Product Dashboard Preview" attributes to all <img> tags.'
    },
    {
        id: 'mobile',
        label: 'Mobile UX',
        icon: '📱',
        score: 91,
        issue: 'Tap Target Spacing < 48px',
        desc: 'Navigation items in footer are spaced 28px apart, leading to misclicks on mobile viewports.',
        fix: 'Increase min-height to 48px and add margin-bottom: 12px to footer links.'
    },
    {
        id: 'performance',
        label: 'Performance UX',
        icon: '⚡',
        score: 88,
        issue: 'Lack of Skeleton Loader',
        desc: 'Users experience blank state flicker before data finishes loading.',
        fix: 'Implement a skeleton card placeholder component for dynamic state transitions.'
    }
];

export default function LandingHero({ onScrollToAudit }) {
    const [activeTab, setActiveTab] = useState('visual');

    const activeDemo = DEMO_CATEGORIES.find(c => c.id === activeTab) || DEMO_CATEGORIES[0];

    const handleNavigate = () => {
        if (onScrollToAudit) {
            onScrollToAudit();
        } else {
            const formSection = document.getElementById('input-form-section');
            if (formSection) {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => {
                    const input = document.getElementById('website-url');
                    input?.focus();
                }, 400);
            }
        }
    };

    return (
        <section className="relative w-full overflow-hidden pt-6 pb-16">
            
            {/* ── Motion Background & Faded Grids ────────────────────────── */}
            <div className="absolute inset-0 bg-grid-pattern opacity-30 radial-fade-mask pointer-events-none z-0" />
            
            {/* Ambient Glowing Orbs */}
            <div className="orb w-[500px] h-[500px] -top-32 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #f97316 0%, #6366f1 50%, transparent 70%)' }} />
            <div className="orb w-[380px] h-[380px] top-40 -left-20 opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
            <div className="orb w-[380px] h-[380px] top-60 -right-20 opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #38bdf8 0%, transparent 70%)' }} />

            {/* Floating Parallax Badges */}
            <div className="hidden lg:block absolute top-36 left-8 animate-float opacity-80 z-10" style={{ animationDuration: '6s' }}>
                <div className="glass-card px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-slate-200 border border-white/10 shadow-xl">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>♿ WCAG 2.2 Compliant Scan</span>
                </div>
            </div>

            <div className="hidden lg:block absolute top-52 right-8 animate-float opacity-80 z-10" style={{ animationDuration: '7s', animationDelay: '1s' }}>
                <div className="glass-card px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-slate-200 border border-white/10 shadow-xl">
                    <span className="text-orange-400 font-bold">⚡ 4.2s</span>
                    <span>Average Audit Time</span>
                </div>
            </div>

            <div className="hidden lg:block absolute bottom-36 left-12 animate-float opacity-80 z-10" style={{ animationDuration: '8s', animationDelay: '2s' }}>
                <div className="glass-card px-3.5 py-2 rounded-2xl flex items-center gap-2.5 text-xs text-slate-200 border border-white/10 shadow-xl">
                    <span className="text-indigo-400">🤖 Gemini 2.5 &amp; Groq</span>
                    <span>Multi-Model AI</span>
                </div>
            </div>

            {/* ── Content Container ───────────────────────────────────────── */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">

                {/* Navbar */}
                <nav className="flex items-center justify-between py-4 mb-10 border-b border-white/10 glass-card px-6 rounded-2xl">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-500 to-amber-500 shadow-md shadow-orange-500/20">
                            <ShieldIcon />
                        </div>
                        <span className="font-display font-700 text-lg text-white tracking-tight">
                            UX Guardian <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">AI</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 text-xs text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>AI Engine Ready</span>
                        </div>
                        <button
                            onClick={handleNavigate}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20 hover:scale-105"
                        >
                            ⚡ Launch Audit
                        </button>
                    </div>
                </nav>

                {/* Hero Header */}
                <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold bg-orange-500/10 border border-orange-500/30 text-orange-400 shadow-inner">
                        <span className="animate-spin text-sm">✦</span>
                        <span>Next-Gen Autonomous UX Intelligence</span>
                        <span className="text-slate-500">|</span>
                        <span className="text-slate-300">All 7 Categories</span>
                    </div>

                    <h1 className="font-display text-4xl sm:text-6xl font-800 tracking-tight text-white leading-[1.15] mb-6">
                        Turn Website Friction into{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-pink-500">
                            High-Converting UX
                        </span>
                    </h1>

                    <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8 font-light">
                        Audit any website URL instantly. Our dual-engine AI scans Visual Design, Accessibility, Mobile Responsiveness, and Navigation to deliver clear scores and code-level fixes in seconds.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                        <button
                            onClick={handleNavigate}
                            className="btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl text-white font-semibold text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 group"
                        >
                            <svg width="20" height="24" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-1 transition-transform">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" />
                            </svg>
                            <span>Run Free UX Audit Now</span>
                        </button>

                        <a
                            href="#product-showcase"
                            className="w-full sm:w-auto px-6 py-4 rounded-2xl text-slate-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 border border-white/10 hover:border-white/20 bg-slate-900/50 hover:bg-slate-900 transition-all"
                        >
                            <span>👀 See How Product Works</span>
                        </a>
                    </div>

                    {/* Statistics Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 px-4 rounded-2xl glass-card border border-white/10">
                        {[
                            { value: '7 / 7', label: 'UX Dimensions Audited' },
                            { value: '< 4.5s', label: 'Average Scan Speed' },
                            { value: '100%', label: 'Automated Signal Extraction' },
                            { value: 'WCAG 2.2', label: 'Accessibility Standards' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center p-2">
                                <div className="text-xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                                    {stat.value}
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium mt-0.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Product Interactive Showcase Card (#product-showcase) ── */}
                <div id="product-showcase" className="mt-16 pt-8">
                    <div className="text-center mb-8">
                        <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Product Experience</span>
                        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
                            Inside the AI UX Scorecard
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
                            Click across categories below to explore live sample audit results generated by the AI engine.
                        </p>
                    </div>

                    <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 glow-box-orange">
                        
                        {/* Demo Category Switcher */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                            {DEMO_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                                        activeTab === cat.id
                                            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                                            : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5'
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.label}</span>
                                    <span className="px-1.5 py-0.5 rounded bg-black/20 text-[10px] font-mono">
                                        {cat.score}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Interactive Demo Content Display */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-950/80 rounded-2xl p-6 border border-white/10">
                            
                            {/* Left Score Pillar */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/90 border border-white/5 text-center">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                    {activeDemo.label} Score
                                </div>
                                
                                <div className="relative w-28 h-28 flex items-center justify-center my-2">
                                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                        <path
                                            className="text-slate-800"
                                            strokeWidth="3"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="text-orange-500 transition-all duration-700 ease-out"
                                            strokeDasharray={`${activeDemo.score}, 100`}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            stroke="currentColor"
                                            fill="none"
                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                    <span className="absolute text-3xl font-bold font-display text-white">
                                        {activeDemo.score}
                                    </span>
                                </div>

                                <span className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
                                    ✓ Scanned against WCAG standards
                                </span>
                            </div>

                            {/* Right Sample Issue & Solution */}
                            <div className="lg:col-span-8 space-y-4 text-left">
                                <div className="flex items-center gap-2">
                                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide bg-red-500/20 text-red-400 border border-red-500/30">
                                        High Severity Issue
                                    </span>
                                    <span className="text-xs text-slate-400 font-mono">Category: {activeDemo.label}</span>
                                </div>

                                <h3 className="text-lg font-semibold text-white">
                                    {activeDemo.issue}
                                </h3>

                                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-white/5">
                                    {activeDemo.desc}
                                </p>

                                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-1.5">
                                    <div className="text-xs font-semibold text-orange-400 flex items-center gap-1.5">
                                        <span>💡 Recommended Fix:</span>
                                    </div>
                                    <p className="text-xs text-slate-200 font-mono">
                                        {activeDemo.fix}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Scroll Banner below Showcase */}
                        <div className="mt-8 text-center pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span className="text-xs text-slate-400">
                                Ready to audit your own website? Enter your URL to generate your custom report.
                            </span>
                            <button
                                onClick={handleNavigate}
                                className="px-6 py-3 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/20"
                            >
                                🚀 Start Audit Form Below ↓
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
