// Ranked optimization suggestions table with expandable rows
import { useState } from 'react'

const TYPE_ICONS = {
    model_swap: '🔄',
    precision: '⚡',
    compute_route: '🎯',
    batch_size: '📦',
}

import API from '../config.js'

export default function OptimizationTable({ suggestions, runId }) {
    const [expanded, setExpanded] = useState(null)

    if (!suggestions?.length) return null

    return (
        <div className="glass-card fade-in" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                        Neural Optimization
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                        Ranked Configuration Paths
                    </div>
                </div>
                {runId && (
                    <button
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.5px' }}
                        onClick={() => window.open(API.exportRun(runId, 'csv'), '_blank')}
                    >
                        EXPORT ENGINE DATA (.CSV)
                    </button>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {suggestions.map((s, i) => {
                    const isHero = i === 0;
                    return (
                        <div key={s.suggestion_id || i}>
                            <div
                                onClick={() => setExpanded(expanded === i ? null : i)}
                                className={isHero ? 'glass-premium' : ''}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '16px',
                                    padding: isHero ? '20px 24px' : '16px 20px',
                                    background: isHero ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-surface-elevated)',
                                    border: isHero ? '1px solid var(--optimal)' : '1px solid var(--border-muted)',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    position: 'relative',
                                    boxShadow: isHero ? '0 8px 16px -4px rgba(16, 185, 129, 0.1)' : 'none'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = isHero ? 'var(--optimal)' : 'var(--border-active)';
                                    if (!isHero) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = isHero ? 'var(--optimal)' : 'var(--border-muted)';
                                    if (!isHero) e.currentTarget.style.background = 'var(--bg-surface-elevated)';
                                }}
                            >
                                {isHero && (
                                    <div style={{
                                        position: 'absolute', top: '-10px', left: '20px',
                                        background: 'var(--optimal)', color: '#000', fontSize: '8px',
                                        fontWeight: 900, padding: '2px 8px', borderRadius: '4px',
                                        letterSpacing: '0.5px'
                                    }}>
                                        HIGHEST IMPACT
                                    </div>
                                )}

                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    background: isHero ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-base)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px',
                                    border: isHero ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-muted)'
                                }}>
                                    {TYPE_ICONS[s.type] || '💡'}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{s.title}</div>
                                    <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }} className="mono">
                                        {s.current_config} → <span style={{ color: isHero ? 'var(--optimal)' : 'var(--info)', fontWeight: 800 }}>{s.suggested_config}</span>
                                    </div>
                                </div>

                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div className="mono" style={{ fontSize: '18px', fontWeight: 900, color: i === 0 ? 'var(--optimal)' : 'var(--info)' }}>
                                        -{s.energy_saving_pct?.toFixed(0)}%
                                    </div>
                                    <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Power Drop
                                    </div>
                                </div>

                                <div style={{ height: '32px', width: '1px', background: 'var(--border-muted)' }} />

                                <span className={s.priority === 'High' ? 'badge-high' : s.priority === 'Med' ? 'badge-med' : 'badge-low'} style={{
                                    fontSize: '9px', fontWeight: 900, padding: '4px 10px',
                                    borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.5px'
                                }}>
                                    {s.priority}
                                </span>
                            </div>

                            {expanded === i && (
                                <div className="fade-in" style={{
                                    margin: '0 8px',
                                    borderLeft: '1px solid var(--border-muted)',
                                    borderRight: '1px solid var(--border-muted)',
                                    borderBottom: '1px solid var(--border-muted)',
                                    padding: '20px',
                                    background: 'rgba(255,255,255,0.01)',
                                    borderRadius: '0 0 12px 12px',
                                    boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.2)'
                                }}>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginBottom: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Carbon Offset: <span style={{ color: 'var(--optimal)' }}>{s.co2_saved_per_1k_calls?.toFixed(2)}g</span> per 1k operations
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 800, marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Implementation Blueprint:</div>
                                    {s.implementation_steps?.filter(Boolean).map((step, j) => (
                                        <div key={j} className="mono" style={{ fontSize: '11px', color: 'var(--text-secondary)', padding: '6px 0', paddingLeft: '16px', position: 'relative' }}>
                                            <div style={{ position: 'absolute', left: 0, top: '14px', width: '6px', height: '1px', background: 'var(--border-active)' }} />
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
