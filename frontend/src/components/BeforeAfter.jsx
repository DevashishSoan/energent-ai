// Before/After comparison panel: baseline vs optimized run
const GRADE_COLORS = {
    'A+': '#00ff88', 'A': '#22d3ee', 'B+': '#a3e635', 'B': '#facc15',
    'C+': '#fb923c', 'C': '#f97316', 'D': '#ef4444', 'F': '#dc2626',
}

export default function BeforeAfter({ baseline, optimized }) {
    if (!baseline || !optimized) return null

    const savingPct = baseline.avg_watts
        ? ((baseline.avg_watts - optimized.avg_watts) / baseline.avg_watts * 100).toFixed(0)
        : null

    return (
        <div className="glass-card card-glow fade-in" style={{ padding: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
                Before vs After Optimization
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '12px', alignItems: 'center' }}>
                {/* Baseline */}
                <RunCard run={baseline} label="BEFORE" dimmed />

                {/* Arrow + saving */}
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', color: '#00ff88' }}>→</div>
                    {savingPct && (
                        <div className="mono" style={{ fontSize: '14px', fontWeight: 800, color: '#00ff88', marginTop: '4px' }}>
                            -{savingPct}%
                        </div>
                    )}
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>energy</div>
                </div>

                {/* Optimized */}
                <RunCard run={optimized} label="AFTER" />
            </div>

            {savingPct && (
                <div style={{
                    marginTop: '16px', padding: '10px 14px',
                    background: 'rgba(0,255,136,0.08)',
                    border: '1px solid rgba(0,255,136,0.25)',
                    borderRadius: '10px',
                    textAlign: 'center',
                    fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600,
                }}>
                    🎯 <span style={{ color: '#00ff88' }}>{savingPct}% energy reduction</span> — same output, {savingPct >= 80 ? 'AMD NPU wins.' : 'optimized config.'}
                </div>
            )}
        </div>
    )
}

function RunCard({ run, label, dimmed }) {
    const gradeColor = run.grade ? (GRADE_COLORS[run.grade] || '#7a9e8e') : '#3d6050'
    return (
        <div style={{
            padding: '14px',
            background: dimmed ? 'rgba(255,255,255,0.02)' : 'rgba(0,255,136,0.04)',
            border: `1px solid ${dimmed ? 'var(--border)' : 'rgba(0,255,136,0.2)'}`,
            borderRadius: '12px',
            textAlign: 'center',
        }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: dimmed ? 'var(--text-muted)' : 'var(--green)', marginBottom: '8px' }}>
                {label}
            </div>
            <div className="mono" style={{ fontSize: '28px', fontWeight: 800, color: gradeColor }}>
                {run.grade || '—'}
            </div>
            <div className="mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '6px' }}>
                {run.avg_watts?.toFixed(1)}W
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {run.model?.split('/').pop()?.split('-').slice(0, 2).join('-')}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {run.precision} · {run.compute_target?.toUpperCase()}
            </div>
        </div>
    )
}
