// Side-by-side AMD NPU vs GPU vs Cloud comparison panel
const HARDWARE_DATA = [
    { label: 'AMD NPU', watts: 3.1, color: '#00ff88', badge: 'WINNER', badgeColor: '#00ff88' },
    { label: 'AMD GPU', watts: 18.4, color: '#3b82f6', badge: null },
    { label: 'Cloud A100', watts: 312, color: '#ef4444', badge: 'CLOUD', badgeColor: '#ef4444' },
]

export default function HardwareCompare({ npuWatts, gpuWatts }) {
    const data = [
        { label: 'AMD NPU', watts: npuWatts ?? 3.1, color: '#00ff88', badge: 'WINNER' },
        { label: 'AMD GPU', watts: gpuWatts ?? 18.4, color: '#3b82f6', badge: null },
        { label: 'Cloud A100', watts: 312, color: '#ef4444', badge: 'CLOUD' },
    ]
    const maxWatts = Math.max(...data.map(d => d.watts))

    return (
        <div className="card">
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '16px' }}>
                Hardware Comparison
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {data.map(item => (
                    <div key={item.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
                                {item.badge && (
                                    <span style={{
                                        fontSize: '9px', fontWeight: 700, padding: '2px 6px',
                                        borderRadius: '4px', letterSpacing: '0.5px',
                                        background: `${item.color}20`, color: item.color,
                                        border: `1px solid ${item.color}40`,
                                    }}>
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className="mono" style={{ fontSize: '14px', fontWeight: 700, color: item.color }}>
                                {item.watts.toFixed(1)}W
                            </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${(item.watts / maxWatts) * 100}%`,
                                background: item.color,
                                borderRadius: '3px',
                                transition: 'width 0.8s ease',
                                boxShadow: `0 0 8px ${item.color}60`,
                            }} />
                        </div>
                    </div>
                ))}
            </div>

            <div style={{
                marginTop: '16px', padding: '10px 12px',
                background: 'rgba(0,255,136,0.05)',
                border: '1px solid rgba(0,255,136,0.15)',
                borderRadius: '8px',
                fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5,
            }}>
                AMD NPU delivers <span style={{ color: '#00ff88', fontWeight: 700 }}>~83% less energy</span> than GPU for compatible inference tasks.
                Cloud A100: <span style={{ color: '#ef4444', fontWeight: 600 }}>100× more</span> power for same output.
            </div>
        </div>
    )
}
