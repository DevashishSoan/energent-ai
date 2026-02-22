// Fallback story panel — answers "What if you don't have AMD hardware?"
// Shown in header status bar when hardware is estimated (not live)
export default function FallbackStory({ hardware }) {
    const isEstimated = hardware && !hardware.rocm_smi_available

    if (!isEstimated) return null

    return (
        <div style={{
            padding: '8px 14px',
            background: 'rgba(245,158,11,0.06)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: '8px',
            fontSize: '11px', color: '#f59e0b', lineHeight: 1.6,
            display: 'flex', alignItems: 'flex-start', gap: '8px',
        }}>
            <span style={{ fontSize: '14px', flexShrink: 0 }}>🛡️</span>
            <div>
                <strong>Running in Estimation Mode</strong>
                <br />
                rocm-smi not detected → using TDP × utilization fallback.{' '}
                <span style={{ color: 'var(--text-secondary)' }}>
                    Predictions still work — they're model-based, not hardware-based.
                    Demo runs on any machine.
                </span>
            </div>
        </div>
    )
}
