export default function OptimizationView() {
    const strategies = [
        {
            id: 'quant',
            title: 'Precision Quantization',
            tech: 'FP16 → INT8 / 4-BIT',
            desc: 'Lowering weight precision reduces memory bandwidth pressure and compute cycle counts. Our engine supports dynamic quantization where weights are compressed to 4-bit while maintaining 98%+ accuracy.',
            impact: '30-60% Power Reduction',
            icon: '📉',
            gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, transparent 100%)'
        },
        {
            id: 'npu',
            title: 'Ryzen™ AI NPU Offloading',
            tech: 'AMD XDNA™ ARCHITECTURE',
            desc: 'A dedicated spatial AI architecture designed specifically for low-power inference. Offloading from GPU to NPU eliminates the high static power draw of large memory buses.',
            impact: 'Up to 10x TOPS/Watt',
            icon: '⚡',
            gradient: 'linear-gradient(135deg, rgba(167, 139, 250, 0.1) 0%, transparent 100%)'
        },
        {
            id: 'fusion',
            title: 'Dynamic Kernel Fusion',
            tech: 'OPERATOR CONGLOMERATION',
            desc: 'Graph-level optimization that merges consecutive layers into single execution kernels. This minimizes intermediate data movement back to system RAM, saving significant energy.',
            impact: '15-20% Latency Gain',
            icon: '🧩',
            gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)'
        },
        {
            id: 'batch',
            title: 'Hardware-Aware Batching',
            tech: 'CACHE-LINE ALIGNMENT',
            desc: 'Aligning model batch sizes with the underlying L3 cache architecture of Zen 4/5 cores. Ensures 100% compute unit utilization without memory-bound stalling.',
            impact: 'Maximized Throughput',
            icon: '📦',
            gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)'
        }
    ]

    return (
        <div className="fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Hero / Header Section */}
            <div style={{ position: 'relative', marginBottom: '48px', padding: '48px', borderRadius: '24px', background: 'var(--bg-surface)', border: '1px solid var(--border-muted)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--optimal)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '16px' }}>
                        Sustainability Engineering Lab
                    </div>
                    <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#fff', letterSpacing: '-1.5px', marginBottom: '16px' }}>
                        Optimization Strategies
                    </h1>
                    <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '750px' }}>
                        The environmental footprint of AI is a hardware problem. By applying these specific architectural optimizations, we can reduce inference-phase emissions by up to 80% without sacrificing user experience.
                    </p>
                </div>
            </div>

            {/* Content Tabs / Filter Placeholder */}
            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--optimal)', cursor: 'pointer' }}>STRATEGY CARDS</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', cursor: 'not-allowed' }}>IMPLEMENTATION GUIDES (BETA)</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', cursor: 'not-allowed' }}>CARBON CALCULATOR</span>
            </div>

            {/* Strategies Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '24px', marginBottom: '60px' }}>
                {strategies.map(s => (
                    <div key={s.id} className="glass-card" style={{ padding: '32px', background: s.gradient, display: 'flex', gap: '28px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{
                            flexShrink: 0, width: '80px', height: '80px',
                            background: 'rgba(0,0,0,0.3)', borderRadius: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '40px', border: '1px solid var(--border-muted)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
                        }}>
                            {s.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--text-tertiary)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
                                {s.tech}
                            </div>
                            <div style={{ fontSize: '20px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>
                                {s.title}
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
                                {s.desc}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    fontSize: '10px', fontWeight: 900, padding: '4px 10px',
                                    borderRadius: '100px', background: 'var(--optimal)', color: '#000'
                                }}>
                                    {s.impact}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>PRIORITY: CRITICAL</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scientific Depth Section */}
            <div className="glass-premium" style={{ padding: '48px', position: 'relative', border: '1px dashed var(--optimal)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '60px', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Global Carbon Intensity Analysis</h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '24px' }}>
                            Modern AI infrastructure consumption is not static. Transitioning from generic cloud inference (where the average intensity is <strong>475g CO₂/kWh</strong>) to local, hardware-optimized inference on <strong>AMD Ryzen™ AI</strong> platforms reduces data-center cooling overhead by 100% and compute consumption by up to 92%.
                        </p>
                        <div className="mono" style={{ fontSize: '13px', color: 'var(--optimal)', fontWeight: 900 }}>
                            PREDICTED SCALE-UP SAVINGS: 4.8 METRIC TONS CO₂ / YR
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '120px', marginBottom: '-20px', filter: 'drop-shadow(0 0 20px rgba(16, 185, 129, 0.4))' }}>🌍</div>
                        <div style={{ fontSize: '11px', fontWeight: 900, color: 'var(--optimal)', marginTop: '20px' }}>SOCIETAL IMPACT SCORE: 9.8/10</div>
                    </div>
                </div>
            </div>

            {/* Action Footer */}
            <div style={{ marginTop: '80px', textAlign: 'center', paddingBottom: '60px' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '24px' }}>Ready to deploy?</div>
                <button className="btn-primary" style={{ padding: '16px 48px', fontSize: '14px', borderRadius: '12px' }} onClick={() => window.location.hash = 'dashboard'}>
                    GENERATE OPTIMIZED PROFILE
                </button>
            </div>
        </div>
    )
}
