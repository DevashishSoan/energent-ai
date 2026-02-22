// PreOpt AI Prediction Panel — appears on model selection, before Run
// Shows predicted watts, grade, best alternative, and Apply Before Run button

const GRADE_COLORS = {
    'A+': '#00ff88', 'A': '#22d3ee', 'B+': '#a3e635', 'B': '#facc15',
    'C+': '#fb923c', 'C': '#f97316', 'D': '#ef4444', 'F': '#dc2626',
}

const CONFIDENCE_COLORS = { HIGH: '#00ff88', MEDIUM: '#f59e0b', LOW: '#ef4444' }

export default function PredictionPanel({ prediction, loading, onApply }) {
    if (loading) {
        return (
            <div className="glass-card fade-in" style={{
                borderColor: 'rgba(0,255,136,0.1)',
                minHeight: '140px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px'
            }}>
                <div className="pulse" style={{ fontSize: '24px' }}>🔮</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>
                    GENERATING ENERGY FORECAST...
                </div>
            </div>
        )
    }

    if (!prediction) return null

    const { predicted_watts, predicted_grade, predicted_co2_per_1k, confidence, best_alternative, alternatives } = prediction
    const gradeColor = GRADE_COLORS[predicted_grade] || '#7a9e8e'
    const confColor = CONFIDENCE_COLORS[confidence] || '#7a9e8e'

    return (
        <div className="glass-card fade-in card-glow" style={{
            padding: '20px',
            background: 'linear-gradient(180deg, rgba(0,255,136,0.05) 0%, rgba(13,24,33,0.95) 100%)',
            border: '1px solid rgba(255,255,255,0.05)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle Top Glow Line */}
            <div style={{
                position: 'absolute', top: 0, left: '10%', right: '10%', height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0,255,136,0.3), transparent)'
            }} />

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,255,136,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                    }}>🔮</div>
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                            Predictive Engine
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>
                            PreOpt <span style={{ color: '#00ff88' }}>Forecast</span>
                        </div>
                    </div>
                </div>
                <div style={{
                    fontSize: '9px', fontWeight: 900, padding: '4px 10px',
                    borderRadius: '4px', letterSpacing: '1px', textTransform: 'uppercase',
                    background: `${confColor}10`, color: confColor, border: `1px solid ${confColor}30`,
                }}>
                    {confidence} CONFIDENCE
                </div>
            </div>

            {/* Main Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {/* Wattage */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 800, letterSpacing: '1px' }}>POWER</div>
                    <div className="mono" style={{ fontSize: '26px', fontWeight: 900, color: '#fff', lineHeight: 1 }}>
                        {predicted_watts?.toFixed(1)}<span style={{ fontSize: '14px', color: 'var(--green)', marginLeft: '2px' }}>W</span>
                    </div>
                </div>

                {/* Grade */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 800, letterSpacing: '1px' }}>GRADE</div>
                    <div style={{ fontSize: '26px', fontWeight: 900, color: gradeColor, lineHeight: 1, filter: `drop-shadow(0 0 10px ${gradeColor}40)` }}>
                        {predicted_grade}
                    </div>
                </div>

                {/* CO2 Section — Enhanced for Persuasive Impact */}
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 800, letterSpacing: '1px' }}>IMPACT</div>
                    <div className="mono" style={{ fontSize: '22px', fontWeight: 900, color: 'var(--optimal)', lineHeight: 1 }}>
                        {predicted_co2_per_1k?.toFixed(2)}<span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '2px' }}>g</span>
                    </div>
                    <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '8px', fontWeight: 600 }}>
                        {(predicted_co2_per_1k / 8.3).toFixed(1)} smartphone charges*
                    </div>
                </div>
            </div>

            {/* Persuasive Comparison Bar */}
            <div style={{ marginBottom: '24px', padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '9px', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                    <span>ENERGY PROFILE VS BASELINE</span>
                    <span style={{ color: 'var(--optimal)' }}>-{((1 - predicted_watts / 60) * 100).toFixed(0)}% LOWER THAN MAX</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.04)', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    {/* Baseline (Ghost Bar) */}
                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', background: 'rgba(255,255,255,0.05)' }} />
                    {/* Current Prediction */}
                    <div style={{
                        position: 'absolute', top: 0, left: 0, height: '100%',
                        width: `${Math.min((predicted_watts / 60) * 100, 100)}%`,
                        background: `linear-gradient(90deg, var(--info), ${gradeColor})`,
                        borderRadius: '3px',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '8px', color: 'var(--text-tertiary)', fontWeight: 700 }}>
                    <span className="mono">0W</span>
                    <span className="mono">MAX LOAD (60W)</span>
                </div>
            </div>

            {/* Best Alternative - Hero Box */}
            {best_alternative && (
                <div style={{
                    padding: '20px',
                    background: 'rgba(0,255,136,0.03)',
                    border: '1px solid rgba(0,255,136,0.2)',
                    borderRadius: '16px',
                    marginBottom: '20px',
                    position: 'relative',
                    boxShadow: 'inset 0 0 20px rgba(0,255,136,0.02)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#000' }}>⭐</div>
                                <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 800, letterSpacing: '1px' }}>OPTIMAL PATH</span>
                            </div>

                            <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
                                Switch to {best_alternative.compute_target?.toUpperCase()} · <span style={{ color: 'var(--green)' }}>{best_alternative.precision}</span>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>SAVINGS</div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--green)' }}>-{best_alternative.saving_pct?.toFixed(0)}% Power</div>
                                </div>
                                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)', alignSelf: 'center' }} />
                                <div>
                                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: 700 }}>ACCURACY</div>
                                    <div style={{ fontSize: '14px', fontWeight: 800, color: best_alternative.accuracy_delta === 0 ? '#fff' : 'var(--amber)' }}>
                                        {best_alternative.accuracy_delta === 0 ? 'No Loss' : `${best_alternative.accuracy_delta?.toFixed(1)}% Δ`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {onApply && (
                            <button
                                className="btn-primary"
                                style={{
                                    padding: '12px 24px',
                                    fontSize: '11px',
                                    fontWeight: 900,
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    boxShadow: '0 8px 16px rgba(0,255,136,0.15)',
                                    borderRadius: '8px'
                                }}
                                onClick={() => onApply(best_alternative)}
                            >
                                Apply All
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Other Alternatives List */}
            {alternatives?.length > 1 && (
                <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, marginBottom: '12px', letterSpacing: '1.2px', textTransform: 'uppercase' }}>Alternative Configurations</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {alternatives.slice(1, 4).map((alt, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.04)',
                                borderRadius: '10px',
                                fontSize: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ color: '#fff', fontWeight: 700 }}>{alt.compute_target?.toUpperCase()}</span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>/</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>{alt.precision}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="mono" style={{ color: 'var(--green)', fontWeight: 700 }}>
                                        -{alt.saving_pct?.toFixed(0)}%
                                    </span>
                                    <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', width: '40px', textAlign: 'right' }}>
                                        {alt.predicted_watts?.toFixed(0)}W
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
