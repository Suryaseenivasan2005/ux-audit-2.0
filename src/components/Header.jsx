import React from 'react';

const ShieldIcon = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7V12C3 16.5 7 20.7 12 22C17 20.7 21 16.5 21 12V7L12 2Z"
            fill="url(#hShieldGrad)" />
        <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <defs>
            <linearGradient id="hShieldGrad" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fb923c" />
                <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
        </defs>
    </svg>
);

const FEATURES = [
    { icon: '⚡', label: 'Automated Flow' },
    { icon: '🎯', label: '7 Category Scores' },
    { icon: '📊', label: 'Visual Data' },
    { icon: '🔍', label: 'Actionable Insights' },
];

export default function Header() {
    return (
        <header className="relative w-full overflow-hidden">
            {/* BG orbs */}
            <div className="orb w-96 h-96 -top-48 -left-24 opacity-25"
                style={{ background: 'radial-gradient(circle, #f97316, transparent)' }} />
            <div className="orb w-72 h-72 -top-24 -right-16 opacity-15"
                style={{ background: 'radial-gradient(circle, #fb923c, transparent)' }} />

            <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-8">
                {/* Nav */}
                <nav className="flex items-center justify-between mb-14">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #f97316, #fb923c)' }}>
                            <ShieldIcon />
                        </div>
                        <span className="font-display font-700 text-lg text-white tracking-tight">
                            UX Guardian <span style={{
                                background: 'linear-gradient(135deg, #f97316, #fb923c)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>AI</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                            Groq · Llama 3.3 70B
                        </span>
                    </div>
                </nav>

                {/* Hero */}
                <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 text-xs font-medium px-4 py-1.5 rounded-full mb-6"
                        style={{
                            color: '#fb923c',
                            background: 'rgba(249,115,22,0.1)',
                            border: '1px solid rgba(249,115,22,0.25)',
                        }}>
                        <span>✦</span>
                        <span>AI-Powered UX Intelligence — No Screenshot Required</span>
                        <span>✦</span>
                    </div>

                    <h1 className="font-display text-5xl sm:text-6xl font-800 leading-tight mb-5 text-white">
                        Audit Your Website{' '}
                        <span style={{
                            background: 'linear-gradient(135deg, #fb923c 0%, #f59e0b 50%, #ef4444 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>UX</span>
                        <br />
                        in Seconds
                    </h1>

                    <p className="text-slate-400 text-lg leading-relaxed max-w-xl mx-auto">
                        Enter a website URL and instantly get a comprehensive automated 
                        UX audit covering 7 key dimensions — powered by Groq.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
                        {FEATURES.map(({ icon, label }) => (
                            <span key={label}
                                className="flex items-center gap-1.5 text-xs text-slate-400 px-3 py-1.5 rounded-full"
                                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                                <span>{icon}</span> {label}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-10 mt-10 pt-8 border-t border-white/5">
                        {[
                            { label: 'UX Dimensions', value: '7' },
                            { label: 'Analysis Time', value: '<10s' },
                            { label: 'Charts Generated', value: '4+' },
                        ].map(({ label, value }) => (
                            <div key={label} className="text-center">
                                <div className="text-2xl font-display font-700" style={{
                                    background: 'linear-gradient(135deg, #fb923c, #f59e0b)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}>{value}</div>
                                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
