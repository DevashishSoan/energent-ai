// Enterprise Grade colors (Restrained Emerald & Zinc)
// Semantic Color Logic for Grades
const GRADE_COLORS = {
    'A+': 'var(--optimal)', 'A': 'var(--optimal)',
    'B+': 'var(--info)', 'B': 'var(--info)',
    'C+': 'var(--warning)', 'C': 'var(--warning)',
    'D': 'var(--alert)', 'F': 'var(--alert)',
}

const GRADE_LABELS = {
    'A+': 'OPTIMIZED ENGINE', 'A': 'EFFICIENT NODE', 'B+': 'STABLE LOAD', 'B': 'STANDARD OPS',
    'C+': 'MODERATE DRAW', 'C': 'HIGH CONSUMPTION', 'D': 'SUB-OPTIMAL', 'F': 'CRITICAL EMISSION',
}

export default function EfficiencyGrade({ grade, co2PerRun, avgWatts, isPredicted }) {
    const color = grade ? GRADE_COLORS[grade] || 'var(--text-tertiary)' : 'var(--text-muted)'
    const label = grade ? GRADE_LABELS[grade] || '' : '—'

    return (
        <div className="glass-card" style={{ textAlign: 'center', position: 'relative', padding: '24px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {isPredicted && (
                <div style={{
                    position: 'absolute', top: '12px', right: '12px',
                    fontSize: '8px', fontWeight: 800, letterSpacing: '1px',
                    color: 'var(--amber)', textTransform: 'uppercase',
                    padding: '2px 6px', background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '4px'
                }}>
                    PREDICTED
                </div>
            )}

            <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Performance Grade
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {grade ? (
                    <>
                        <div className="fade-in" style={{
                            fontSize: '64px',
                            fontWeight: 800,
                            color,
                            lineHeight: 0.9,
                            letterSpacing: '-2px',
                            transition: 'color 0.5s',
                        }}>
                            {grade}
                        </div>

                        <div className="fade-in" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>
                            {label}
                        </div>
                    </>
                ) : (
                    <div style={{ padding: '20px 0', opacity: 0.5 }}>
                        <div className="live-dot" style={{ margin: '0 auto 12px' }} />
                        <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 800 }}>IDLE STATE</div>
                    </div>
                )}
            </div>

            {avgWatts != null && (
                <div style={{ marginTop: '20px', display: 'flex', gap: '8px', justifyContent: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
                    <div style={{ flex: 1 }}>
                        <div className="mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {avgWatts.toFixed(1)}<span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>W</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase' }}>Avg Pwr</div>
                    </div>
                    <div style={{ width: '1px', background: 'var(--border-muted)', height: '24px', alignSelf: 'center' }} />
                    <div style={{ flex: 1 }}>
                        <div className="mono" style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {co2PerRun != null ? co2PerRun.toFixed(2) : (avgWatts * 0.04).toFixed(2)}<span style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>g</span>
                        </div>
                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 800, marginTop: '2px', textTransform: 'uppercase' }}>CO₂ Est.</div>
                    </div>
                </div>
            )}
        </div>
    )
}
