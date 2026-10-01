import React, { useState, useEffect } from 'react';

const AUDIT_STEPS = [
    { id: 'connect', icon: '🌐', title: 'Domain & Connection Setup', desc: 'Resolving SSL certificates and proxy routing' },
    { id: 'signals', icon: '📡', title: 'HTML & Metadata Signals', desc: 'Parsing H1-H6 tags, ARIA roles, viewports & DOM tree' },
    { id: 'visual',  icon: '🎨', title: 'Visual Design & Contrast', desc: 'Auditing color harmonies, font scaling & layout structure' },
    { id: 'a11y',    icon: '♿', title: 'WCAG 2.2 Accessibility', desc: 'Evaluating contrast ratios, focus rings & screen reader readiness' },
    { id: 'mobile',  icon: '📱', title: 'Mobile & Touch Spacing', desc: 'Checking responsive breakpoints & touch target sizes' },
    { id: 'content', icon: '📝', title: 'Content Clarity & Hierarchy', desc: 'Analyzing CTA copy, readability & information density' },
    { id: 'synthesize', icon: '📊', title: 'AI Score Synthesis', desc: 'Generating weighted metrics & actionable fix suggestions' },
];

export default function Loader({ url = 'Target Website', provider = 'AI Engine' }) {
    const [progress, setProgress] = useState(12);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [logs, setLogs] = useState([
        { time: '0.1s', text: `Initializing audit session for ${url}...`, type: 'info' }
    ]);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedSeconds(prev => prev + 1);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 95) return 95;
                const next = prev + Math.floor(Math.random() * 8) + 4;
                return Math.min(next, 95);
            });
        }, 800);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Sync active step based on progress percentage
        const newStepIndex = Math.min(
            Math.floor((progress / 100) * AUDIT_STEPS.length),
            AUDIT_STEPS.length - 1
        );

        if (newStepIndex !== currentStepIndex) {
            setCurrentStepIndex(newStepIndex);
            const step = AUDIT_STEPS[newStepIndex];
            const timestamp = `${(elapsedSeconds + 0.4).toFixed(1)}s`;
            
            setLogs(prev => [
                ...prev,
                { time: timestamp, text: `${step.icon} Active check: ${step.title} — ${step.desc}`, type: 'step' }
            ]);
        }
    }, [progress, currentStepIndex, elapsedSeconds]);

    return (
        <div id="loader-section" className="glass-card rounded-3xl p-6 sm:p-10 text-left section-enter relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Background glowing orb */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

            {/* Top Bar: Header & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                    <div className="relative w-12 h-12 rounded-2xl bg-slate-900 border border-orange-500/30 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/10">
                        <div className="absolute inset-0 rounded-2xl bg-orange-500/20 animate-pulse" />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="relative z-10">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 8v4m0 4h.01" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-display font-700 text-white tracking-tight">
                                Live UX Audit in Progress
                            </h3>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Live Scan
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                            <span>Target: <strong className="text-slate-200">{url}</strong></span>
                            <span>•</span>
                            <span className="text-orange-400 font-medium">⚡ {provider}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
                        <span className="text-slate-500">Timer:</span>
                        <span className="text-orange-400 font-bold">00:{elapsedSeconds < 10 ? `0${elapsedSeconds}` : elapsedSeconds}s</span>
                    </div>
                </div>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-300 flex items-center gap-2">
                        <span>Overall Inspection Progress</span>
                        <span className="text-slate-500">({currentStepIndex + 1} / {AUDIT_STEPS.length} phases completed)</span>
                    </span>
                    <span className="text-orange-400 text-sm font-bold font-mono">{progress}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-900 border border-white/10 p-0.5 overflow-hidden">
                    <div 
                        className="h-full rounded-full transition-all duration-500 ease-out relative"
                        style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #f97316 0%, #fb923c 50%, #6366f1 100%)',
                            boxShadow: '0 0 12px rgba(249, 115, 22, 0.5)'
                        }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Main Grid: Steps Tracker + Live Log Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 7-Step Portfolio Checklist */}
                <div className="lg:col-span-7 space-y-2.5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
                        <span>Audit Tracking Matrix</span>
                        <span className="text-[10px] text-slate-500">Automated Pipeline</span>
                    </h4>
                    
                    {AUDIT_STEPS.map((step, idx) => {
                        const isDone = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;

                        return (
                            <div 
                                key={step.id} 
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all duration-300 border ${
                                    isCurrent 
                                        ? 'bg-orange-500/10 border-orange-500/40 shadow-lg shadow-orange-500/5' 
                                        : isDone 
                                            ? 'bg-slate-900/40 border-emerald-500/20 text-slate-300' 
                                            : 'bg-slate-900/20 border-white/5 opacity-50'
                                }`}
                            >
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5 ${
                                    isDone 
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                        : isCurrent 
                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 animate-pulse' 
                                            : 'bg-slate-800 text-slate-500'
                                }`}>
                                    {isDone ? '✓' : isCurrent ? '●' : idx + 1}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className={`text-xs font-semibold ${isCurrent ? 'text-white' : isDone ? 'text-slate-200' : 'text-slate-500'}`}>
                                            {step.icon} {step.title}
                                        </p>
                                        {isCurrent && (
                                            <span className="text-[10px] font-mono font-medium text-orange-400 animate-pulse">
                                                IN PROGRESS
                                            </span>
                                        )}
                                        {isDone && (
                                            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                                                VERIFIED
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Live Console Feed */}
                <div className="lg:col-span-5 flex flex-col">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Live Diagnostic Console</span>
                    </h4>

                    <div className="flex-1 bg-slate-950/90 rounded-2xl border border-white/10 p-4 font-mono text-xs text-slate-300 overflow-y-auto max-h-[340px] space-y-2 shadow-inner">
                        <div className="text-[10px] text-slate-500 pb-2 border-b border-slate-800 flex justify-between">
                            <span>SESSION LOGS</span>
                            <span>ENCRYPTION: SSL / TLS</span>
                        </div>
                        {logs.map((log, i) => (
                            <div key={i} className="flex items-start gap-2 text-[11px] leading-relaxed animate-fade-in-up">
                                <span className="text-slate-500 font-bold flex-shrink-0">[{log.time}]</span>
                                <span className={
                                    log.type === 'step' ? 'text-orange-300' : 'text-emerald-400'
                                }>
                                    {log.text}
                                </span>
                            </div>
                        ))}
                        <div className="flex items-center gap-2 text-slate-500 pt-1">
                            <span className="w-1.5 h-3 bg-orange-400 animate-pulse" />
                            <span className="text-[10px]">Analyzing DOM nodes &amp; scoring UX dimensions...</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
