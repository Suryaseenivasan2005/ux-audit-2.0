import React, { useState, useEffect } from 'react';
import { UX_CATEGORIES } from '../utils/promptConfig';

/* ─── Colour helpers ──────────────────────────────────────────── */
const scoreColor = (s) =>
    s >= 80 ? '#34d399' : s >= 60 ? '#fbbf24' : s >= 40 ? '#fb923c' : '#f87171';
const scoreLabel = (s) =>
    s >= 80 ? 'Excellent' : s >= 60 ? 'Good' : s >= 40 ? 'Needs Work' : 'Critical';

const SEVERITY_CFG = {
    High:   { color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
    Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.10)',  border: 'rgba(251,191,36,0.25)'  },
    Low:    { color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)'  },
};

const PRIORITY_CFG = {
    'Quick Win':  { color: '#34d399', bg: 'rgba(52,211,153,0.10)',  border: 'rgba(52,211,153,0.25)'  },
    'Strategic':  { color: '#a78bfa', bg: 'rgba(167,139,250,0.10)', border: 'rgba(167,139,250,0.25)' },
    'Long-term':  { color: '#60a5fa', bg: 'rgba(96,165,250,0.10)',  border: 'rgba(96,165,250,0.25)'  },
};

/* ─── Score Gauge (SVG half-circle) ──────────────────────────── */
function ScoreGauge({ score }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => { const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, []);

    if (score === null) return null;
    const clamped = Math.max(0, Math.min(100, score));
    const color = scoreColor(clamped);
    const label = scoreLabel(clamped);
    const radius = 52;
    const circumference = Math.PI * radius;
    const offset = circumference - (animated ? clamped / 100 : 0) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-36 h-20">
                <svg viewBox="0 0 120 65" className="w-full h-full overflow-visible">
                    <path d="M 8 60 A 52 52 0 0 1 112 60"
                        fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 8 60 A 52 52 0 0 1 112 60"
                        fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        style={{ transition: 'stroke-dashoffset 1.6s cubic-bezier(0.4,0,0.2,1)', filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                    {[0, 25, 50, 75, 100].map((v) => {
                        const angle = Math.PI - (v / 100) * Math.PI;
                        const ix = 60 + 52 * Math.cos(angle);
                        const iy = 60 + 52 * Math.sin(-angle);
                        const ox = 60 + 44 * Math.cos(angle);
                        const oy = 60 + 44 * Math.sin(-angle);
                        return <line key={v} x1={ix} y1={iy} x2={ox} y2={oy} stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" />;
                    })}
                </svg>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center leading-none">
                    <div className="text-4xl font-display font-800" style={{ color }}>{clamped}</div>
                    <div className="text-xs text-slate-500 mt-0.5">/100</div>
                </div>
            </div>
            <div className="mt-2 text-sm font-semibold" style={{ color }}>{label}</div>
        </div>
    );
}

/* ─── Category Score Bar ──────────────────────────────────────── */
function CategoryBar({ label, icon, score, delay = 0 }) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), delay + 200);
        return () => clearTimeout(t);
    }, [delay]);

    if (score === null || score === undefined) return null;
    const clamped = Math.max(0, Math.min(100, score));
    const color = scoreColor(clamped);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{icon}</span>
                    <span className="font-medium text-slate-300">{label}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color }}>{clamped}</span>
                    <span className="text-slate-600">/ 100</span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: `${color}18`, color }}>{scoreLabel(clamped)}</span>
                </div>
            </div>
            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                <div
                    className="h-full rounded-full relative overflow-hidden"
                    style={{
                        width: animated ? `${clamped}%` : '0%',
                        background: `linear-gradient(90deg, ${color}60, ${color})`,
                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${delay}ms`,
                    }}
                >
                    <div className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                            animation: 'shimmer 2s infinite',
                        }} />
                </div>
            </div>
            <div className="flex justify-between text-xs text-slate-700">
                {[0, 25, 50, 75, 100].map(v => <span key={v}>{v}</span>)}
            </div>
        </div>
    );
}

/* ─── Severity Distribution ───────────────────────────────────── */
function SeverityDistribution({ issues }) {
    const high   = issues.filter(i => i.severity === 'High').length;
    const medium = issues.filter(i => i.severity === 'Medium').length;
    const low    = issues.filter(i => i.severity === 'Low').length;
    const total  = Math.max(issues.length, 1);

    const bars = [
        { label: 'High',   count: high,   color: '#f87171', pct: (high / total) * 100 },
        { label: 'Medium', count: medium, color: '#fbbf24', pct: (medium / total) * 100 },
        { label: 'Low',    count: low,    color: '#60a5fa', pct: (low / total) * 100 },
    ];

    return (
        <div className="glass-card rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Issue Severity</p>
            <div className="flex rounded-full overflow-hidden h-3 mb-3 gap-0.5">
                {bars.map(b => b.count > 0 && (
                    <div key={b.label}
                        style={{ width: `${b.pct}%`, background: b.color, transition: 'width 1s ease' }}
                        title={`${b.label}: ${b.count}`}
                    />
                ))}
            </div>
            <div className="flex items-center gap-4">
                {bars.map(b => (
                    <div key={b.label} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: b.color }} />
                        <span className="text-xs text-slate-400">{b.label}</span>
                        <span className="text-xs font-bold" style={{ color: b.color }}>{b.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Priority Distribution ──────────────────────────────────── */
function PriorityDistribution({ suggestions }) {
    const qw  = suggestions.filter(s => s.priority === 'Quick Win').length;
    const str = suggestions.filter(s => s.priority === 'Strategic').length;
    const lt  = suggestions.filter(s => s.priority === 'Long-term').length;

    return (
        <div className="glass-card rounded-2xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Fix Priority</p>
            <div className="space-y-2">
                {[
                    { label: 'Quick Win', count: qw,  color: '#34d399' },
                    { label: 'Strategic', count: str, color: '#a78bfa' },
                    { label: 'Long-term', count: lt,  color: '#60a5fa' },
                ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className="w-20 text-right text-xs text-slate-500 flex-shrink-0">{label}</div>
                        <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full"
                                style={{
                                    width: `${(count / Math.max(suggestions.length, 1)) * 100}%`,
                                    background: color,
                                    transition: 'width 1.2s ease',
                                }} />
                        </div>
                        <span className="text-xs font-bold w-4 flex-shrink-0" style={{ color }}>{count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── Stat Card ──────────────────────────────────────────────── */
function StatCard({ value, label, color, icon }) {
    return (
        <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                {icon}
            </div>
            <div>
                <div className="text-2xl font-display font-800 leading-none" style={{ color }}>{value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
        </div>
    );
}

/* ─── Expandable Issue Card ──────────────────────────────────── */
function IssueCard({ issue }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = SEVERITY_CFG[issue.severity] || SEVERITY_CFG.Medium;

    return (
        <div
            onClick={() => setExpanded(x => !x)}
            className="rounded-2xl border cursor-pointer transition-all duration-200 overflow-hidden"
            style={{ background: cfg.bg, borderColor: cfg.border }}
        >
            <div className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                        style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                        {issue.severity}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs text-slate-500">{issue.category}</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-200">{issue.title}</p>
                    {expanded && (
                        <p className="text-sm text-slate-400 leading-relaxed mt-2 pt-2 border-t border-white/5">
                            {issue.description}
                        </p>
                    )}
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    className={`flex-shrink-0 text-slate-500 mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </div>
        </div>
    );
}

/* ─── Suggestion Card ────────────────────────────────────────── */
function SuggestionCard({ suggestion }) {
    const cfg = PRIORITY_CFG[suggestion.priority] || PRIORITY_CFG['Strategic'];
    return (
        <div className="rounded-2xl border p-4 flex gap-3"
            style={{ background: cfg.bg, borderColor: cfg.border }}>
            <div className="flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap"
                    style={{ background: `${cfg.color}20`, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
                    {suggestion.priority}
                </span>
            </div>
            <div className="flex-1 min-w-0">
                {suggestion.category && (
                    <p className="text-xs text-slate-500 mb-0.5">{suggestion.category}</p>
                )}
                <p className="text-sm font-semibold text-slate-200 mb-1">{suggestion.title}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{suggestion.description}</p>
            </div>
        </div>
    );
}

/* ─── Tab Button ─────────────────────────────────────────────── */
function Tab({ active, onClick, children, id }) {
    return (
        <button id={id} onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${active
                    ? 'text-white border'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
            style={active ? {
                background: 'rgba(249,115,22,0.15)',
                borderColor: 'rgba(249,115,22,0.4)',
                color: '#fb923c',
            } : {}}>
            {children}
        </button>
    );
}

/* ─── MAIN COMPONENT ─────────────────────────────────────────── */
export default function ResultDisplay({ result, url, websiteType, onReset }) {
    const [tab, setTab] = useState('issues');
    const isRaw = result?._raw;

    const highCount     = result?.issues?.filter(i => i.severity === 'High').length ?? 0;
    const quickWinCount = result?.suggestions?.filter(s => s.priority === 'Quick Win').length ?? 0;
    const catScores     = result?.category_scores;

    return (
        <div id="results-section" className="space-y-5 section-enter">

            {/* ── Raw text fallback ───────────────────────────── */}
            {isRaw ? (
                <div className="glass-card rounded-3xl p-6">
                    <h3 className="text-base font-display font-600 text-white mb-4">Analysis Output</h3>
                    <pre className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">{result.summary}</pre>
                </div>
            ) : (
                <>
                    {/* ══ SECTION 1: Header + Score + Quick Stats ═══ */}
                    <div className="glass-card rounded-3xl p-6">
                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
                                style={{ background: 'rgba(249,115,22,0.12)', color: '#fb923c', border: '1px solid rgba(249,115,22,0.25)' }}>
                                ⚡ Groq · Llama 3.3 70B
                            </span>
                            {websiteType && (
                                <span className="text-xs px-2.5 py-1 rounded-full text-slate-400"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    {websiteType}
                                </span>
                            )}
                            <span className="text-xs text-slate-600">·</span>
                            <a href={url} target="_blank" rel="noopener noreferrer"
                                className="text-xs text-brand-400 hover:underline truncate max-w-xs">{url}</a>
                        </div>

                        <h2 className="text-xl font-display font-700 text-white mb-1">Full UX Audit Report</h2>
                        <p className="text-xs text-slate-500 mb-5">7 categories · Automated analysis</p>

                        {/* Score + Stats grid */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                            {/* Left: Gauge */}
                            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-center py-6 rounded-2xl h-full justify-center"
                                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">Overall UX Score</p>
                                <ScoreGauge score={result.score} />
                                <p className="text-xs text-slate-500 mt-6 text-center max-w-[220px] leading-relaxed px-4">
                                    {result.summary}
                                </p>
                            </div>

                            {/* Right: Quick-stat cards */}
                            <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <StatCard value={result.issues?.length ?? 0}     label="Total Issues"    color="#f87171" icon="⚠️" />
                                <StatCard value={highCount}                        label="High Severity"   color="#fb923c" icon="🔴" />
                                <StatCard value={quickWinCount}                    label="Quick Wins"      color="#34d399" icon="⚡" />
                                <StatCard value={result.strengths?.length ?? 0}   label="Strengths Found" color="#a78bfa" icon="✅" />
                            </div>
                        </div>
                    </div>

                    {/* ══ SECTION 2: 7 Category Scores ══════════════ */}
                    {catScores && Object.values(catScores).some(v => v !== null) && (
                        <div className="glass-card rounded-3xl p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <div className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
                                    style={{ background: 'rgba(249,115,22,0.15)' }}>📊</div>
                                <h3 className="text-base font-display font-600 text-white">Category Score Breakdown</h3>
                                <span className="ml-auto text-xs text-slate-500">7 dimensions</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                                {UX_CATEGORIES.map((cat, i) => (
                                    catScores[cat.key] !== null && catScores[cat.key] !== undefined && (
                                        <CategoryBar
                                            key={cat.key}
                                            label={cat.label}
                                            icon={cat.icon}
                                            score={catScores[cat.key]}
                                            delay={i * 100}
                                        />
                                    )
                                ))}
                            </div>

                            {/* Average indicator */}
                            {(() => {
                                const vals = UX_CATEGORIES
                                    .map(c => catScores[c.key])
                                    .filter(v => typeof v === 'number');
                                if (!vals.length) return null;
                                const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
                                const color = scoreColor(avg);
                                return (
                                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-xs text-slate-500">Category Average</span>
                                        <span className="text-sm font-bold" style={{ color }}>{avg} / 100</span>
                                    </div>
                                );
                            })()}
                        </div>
                    )}

                    {/* ══ SECTION 3: Distribution Charts ════════════ */}
                    {(result.issues?.length > 0 || result.suggestions?.length > 0) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {result.issues?.length > 0 && <SeverityDistribution issues={result.issues} />}
                            {result.suggestions?.length > 0 && <PriorityDistribution suggestions={result.suggestions} />}
                        </div>
                    )}

                    {/* ══ SECTION 4: Tabbed Detail ══════════════════ */}
                    <div className="glass-card rounded-3xl p-6">
                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 mb-5">
                            <Tab id="tab-issues" active={tab === 'issues'} onClick={() => setTab('issues')}>
                                ⚠ Issues ({result.issues?.length ?? 0})
                            </Tab>
                            <Tab id="tab-suggestions" active={tab === 'suggestions'} onClick={() => setTab('suggestions')}>
                                💡 Suggestions ({result.suggestions?.length ?? 0})
                            </Tab>
                            {result.strengths?.length > 0 && (
                                <Tab id="tab-strengths" active={tab === 'strengths'} onClick={() => setTab('strengths')}>
                                    ✅ Strengths ({result.strengths.length})
                                </Tab>
                            )}
                        </div>

                        {/* ── Issues ── */}
                        {tab === 'issues' && (
                            <div className="space-y-2.5">
                                {[...result.issues]
                                    .sort((a, b) => {
                                        const order = { High: 0, Medium: 1, Low: 2 };
                                        return (order[a.severity] ?? 3) - (order[b.severity] ?? 3);
                                    })
                                    .map((issue, i) => <IssueCard key={i} issue={issue} />)
                                }
                                {result.issues.length === 0 && (
                                    <div className="text-center py-8 text-slate-400">🎉 No issues detected!</div>
                                )}
                            </div>
                        )}

                        {/* ── Suggestions ── */}
                        {tab === 'suggestions' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {[...result.suggestions]
                                    .sort((a, b) => {
                                        const order = { 'Quick Win': 0, 'Strategic': 1, 'Long-term': 2 };
                                        return (order[a.priority] ?? 3) - (order[b.priority] ?? 3);
                                    })
                                    .map((s, i) => <SuggestionCard key={i} suggestion={s} />)
                                }
                            </div>
                        )}

                        {/* ── Strengths ── */}
                        {tab === 'strengths' && result.strengths?.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {result.strengths.map((s, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl h-full"
                                        style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                            style={{ background: 'rgba(52,211,153,0.2)' }}>
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                <path d="M1.5 5l2 2 5-4" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-slate-300 leading-relaxed">{s}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ══ Disclaimer ════════════════════════════════ */}
                    <div className="text-center">
                        <p className="text-xs text-slate-600 leading-relaxed">
                            ⓘ Analysis generated by Groq llama3-70b-8192 using live HTML signals and UX best practices.
                            Conduct live user testing for definitive insights.
                        </p>
                    </div>
                </>
            )}

            {/* ── New Analysis button ─────────────────────────── */}
            <div className="flex justify-center pt-2">
                <button id="new-analysis-btn" onClick={onReset}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors px-5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    New Analysis
                </button>
            </div>
        </div>
    );
}
