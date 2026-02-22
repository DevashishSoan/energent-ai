// CO2 real-world equivalents panel
const CONTEXT_ITEMS = [
    { key: 'km_driven', icon: '🚗', label: 'km driven', decimals: 4 },
    { key: 'phone_charges', icon: '📱', label: 'phone charges', decimals: 3 },
    { key: 'tree_hours', icon: '🌳', label: 'tree-hours to absorb', decimals: 3 },
    { key: 'led_hours', icon: '💡', label: 'LED bulb hours', decimals: 3 },
]

export default function CarbonContext({ co2Grams, context, gridIntensity, gridSource }) {
    if (!co2Grams && !context) return null

    return (
        <div className="glass-card fade-in" style={{ padding: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-tertiary)', letterSpacing: '1.5px', textTransform: 'uppercase' }} className="label-text">
                    Carbon Context
                </div>
                {gridIntensity && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>
                        GRID: <span className="mono" style={{ color: 'var(--optimal)' }}>{gridIntensity.toFixed(0)} G/KWH</span>
                    </div>
                )}
            </div>

            {co2Grams != null && (
                <div style={{ textAlign: 'center', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-muted)' }}>
                    <div className="mono" style={{ fontSize: '42px', fontWeight: 900, color: 'var(--optimal)', letterSpacing: '-1px' }}>
                        {co2Grams < 1 ? co2Grams.toFixed(4) : co2Grams.toFixed(2)}<span style={{ fontSize: '16px', color: 'var(--text-muted)', marginLeft: '4px' }}>g</span>
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--info)', marginTop: '8px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Neural Emissions Footprint
                    </div>
                </div>
            )}

            {context && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    {CONTEXT_ITEMS.map(item => {
                        const val = context[item.key]
                        if (val == null) return null
                        return (
                            <div key={item.key} className="control-glass" style={{
                                padding: '16px 12px',
                                textAlign: 'center',
                                borderRadius: '12px',
                                transition: 'all 0.3s ease'
                            }} onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'var(--optimal)'
                                e.currentTarget.style.boxShadow = '0 0 15px rgba(16, 185, 129, 0.15)'
                            }} onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                                e.currentTarget.style.boxShadow = 'none'
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
                                <div className="mono" style={{ fontSize: '16px', fontWeight: 900, color: '#fff' }}>
                                    {val.toFixed(item.decimals)}
                                </div>
                                <div style={{ fontSize: '8px', color: 'var(--text-tertiary)', marginTop: '4px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
