import React from 'react';

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative mt-16 border-t border-white/5 py-10">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L3 7V12C3 16.5 7 20.7 12 22C17 20.7 21 16.5 21 12V7L12 2Z"
                                fill="white" opacity="0.9" />
                            <path d="M9 12l2 2 4-4" stroke="url(#footerGrad)" strokeWidth="2" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="footerGrad" x1="9" y1="10" x2="15" y2="14" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#6366f1" />
                                    <stop offset="100%" stopColor="#a855f7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <span className="text-sm font-display font-600 text-slate-400">
                        UX Guardian <span className="gradient-text">AI</span>
                    </span>
                </div>

                <p className="text-xs text-slate-600 text-center">
                    © {year} UX Guardian AI &nbsp;·&nbsp; Powered by{' '}
                    <span className="text-brand-500">Gemini 1.5 Flash</span>
                    &nbsp;·&nbsp; Built for UX professionals
                </p>

                <div className="flex items-center gap-4">
                    {['Privacy', 'Terms', 'Docs'].map((link) => (
                        <a key={link} href="#" className="text-xs text-slate-600 hover:text-slate-400 transition-colors">
                            {link}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
