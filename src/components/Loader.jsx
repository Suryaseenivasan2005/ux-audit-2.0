import React from 'react';

const DOT_COUNT = 12;

const STEPS = [
    { label: 'Connecting to Groq API', done: true },
    { label: 'Analyzing UX patterns & structure', done: true },
    { label: 'Scoring 5 UX dimensions', done: false },
];

export default function Loader() {
    return (
        <div id="loader-section" className="glass-card rounded-3xl p-10 text-center section-enter">
            {/* Animated ring */}
            <div className="relative w-28 h-28 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-orange-500/20"
                    style={{ animation: 'pulse-ring 1.8s ease-out infinite' }} />
                <div className="absolute inset-2 rounded-full"
                    style={{
                        background: 'conic-gradient(from 0deg, transparent, #f97316, transparent)',
                        animation: 'spin 1.2s linear infinite',
                    }} />
                <div className="absolute inset-4 rounded-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="url(#loaderGroq)" />
                        <defs>
                            <linearGradient id="loaderGroq" x1="3" y1="2" x2="21" y2="22" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stopColor="#fb923c" />
                                <stop offset="100%" stopColor="#f97316" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            <h3 className="text-xl font-display font-600 text-white mb-2">
                AI is analyzing the website...
            </h3>
            <p className="text-xs font-medium mb-1" style={{ color: '#fb923c' }}>
                ⚡ Groq · Llama 3.3 70B
            </p>
            <p className="text-slate-400 text-sm mb-8 max-w-xs mx-auto">
                Evaluating usability, navigation, accessibility, visual hierarchy,
                and layout consistency across all selected test dimensions.
            </p>

            {/* Dot progress */}
            <div className="flex items-center justify-center gap-1.5 mb-8">
                {Array.from({ length: DOT_COUNT }).map((_, i) => (
                    <div key={i} className="w-2 h-2 rounded-full"
                        style={{
                            background: 'linear-gradient(135deg, #fb923c, #f97316)',
                            animation: `pulse 1.4s ease-in-out ${i * 0.1}s infinite`,
                            opacity: 0.3,
                        }} />
                ))}
            </div>

            {/* Steps */}
            <div className="space-y-2 text-left max-w-xs mx-auto">
                {STEPS.map(({ label, done }, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-500/20' : 'bg-orange-500/20'
                            }`}>
                            {done ? (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5l2 2 4-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400"
                                    style={{ animation: 'pulse 1s ease-in-out infinite' }} />
                            )}
                        </div>
                        <span className={done ? 'text-slate-400' : 'text-white'}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
