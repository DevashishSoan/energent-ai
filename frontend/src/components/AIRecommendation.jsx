import { useState, useEffect } from 'react'

export default function AIRecommendation({ prediction, suggestions }) {
    const [insight, setInsight] = useState(null)

    useEffect(() => {
        if (suggestions?.length > 0) {
            const best = suggestions[0]
            if (best.energy_saving_pct > 50) {
                setInsight(`🔥 Switching to ${best.suggested_config} reduces power by ${best.energy_saving_pct.toFixed(0)}% while maintaining baseline accuracy.`)
            } else {
                setInsight(`💡 Recommendation: Optimized ${best.title} path found for current workload.`)
            }
        } else if (prediction) {
            setInsight(`✨ Neural Forecast: Current model is predicted to operate at ${prediction.predicted_watts?.toFixed(1)}W with ${prediction.confidence} confidence.`)
        } else {
            setInsight(null)
        }
    }, [prediction, suggestions])

    if (!insight) return null

    return (
        <div className="glass-premium fade-in" style={{
            padding: '16px 20px',
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.1) 0%, rgba(10, 11, 12, 0.4) 100%)',
            borderLeft: '4px solid var(--optimal)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
            <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '16px'
            }}>
                🧠
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--optimal)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
                    AI Recommendation Engine
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.4 }} className="fade-in">
                    {insight}
                </div>
            </div>
            <div className="pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--optimal)', opacity: 0.6 }} />
        </div>
    )
}
