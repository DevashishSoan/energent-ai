// AMD NPU Efficiency Story — the "Why AMD?" slide in the app
// Shows the 312W → 18.4W → 3.1W comparison with narrative
const TIERS = [
    {
        label: 'Cloud A100',
        watts: 312,
        color: '#ef4444',
        icon: '☁️',
        note: '100× more power',
        sub: 'Typical cloud inference',
    },
    {
        label: 'AMD GPU',
        watts: 18.4,
        color: '#3b82f6',
        icon: '🖥️',
        note: 'Standard local inference',
        sub: 'RX 7900 (rocm-smi)',
    },
    {
        label: 'AMD NPU',
        watts: 3.1,
        color: '#00ff88',
        icon: '⚡',
        note: '-83% vs GPU',
        sub: 'Ryzen AI (XDNA)',
        winner: true,
    },
]

export default function NPUStory() {
    const maxW = 312

    return (
        <div className="glass-card card-glow" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(13,24,33,0.9) 0%, rgba(0,255,136,0.08) 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'rgba(0,255,136,0.1)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        border: '1px solid rgba(0,255,136,0.2)'
                    }}>
                        <span style={{ fontSize: '18px', filter: 'drop-shadow(0 0 5px var(--green-glow))' }}>⚡</span>
                    </div>
                    <div>
                        <div style={{ fontSize: '15px', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                            Hardware <span style={{ color: 'var(--green)' }}>Efficiency</span>
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                            BENCHMARK: DISTILBERT @ BATCH-1
                        </div>
                    </div>
                </div>
                <div style={{
                    fontSize: '9px', fontWeight: 800, padding: '4px 8px', borderRadius: '4px',
                    background: 'var(--green)', color: '#000', textTransform: 'uppercase'
                }}>
                    NPU optimized
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {TIERS.map(tier => (
                    <div key={tier.label}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '16px', opacity: 0.8 }}>{tier.icon}</span>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 800, color: tier.winner ? '#fff' : 'var(--text-secondary)' }}>{tier.label}</span>
                                        {tier.winner && <span style={{ fontSize: '8px', padding: '1px 4px', background: 'rgba(0,255,136,0.1)', color: '#00ff88', borderRadius: '3px', fontWeight: 800 }}>BEST</span>}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 600 }}>{tier.sub}</div>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div className="mono" style={{ fontSize: '16px', fontWeight: 900, color: tier.color, textShadow: tier.winner ? `0 0 15px ${tier.color}40` : 'none' }}>
                                    {tier.watts}<span style={{ fontSize: '10px', opacity: 0.8 }}>W</span>
                                </div>
                                <div style={{ fontSize: '9px', color: tier.winner ? '#00ff88' : 'var(--text-tertiary)', fontWeight: 700, textTransform: 'uppercase' }}>{tier.note}</div>
                            </div>
                        </div>
                        <div style={{ height: '4px', background: 'rgba(255,255,255,0.03)', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{
                                height: '100%',
                                width: `${(tier.watts / maxW) * 100}%`,
                                background: tier.color,
                                borderRadius: '2px',
                                boxShadow: tier.winner ? `0 0 15px ${tier.color}80` : 'none',
                                transition: 'width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
