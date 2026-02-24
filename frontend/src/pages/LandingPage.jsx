import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function LandingPage() {
    const navigate = useNavigate()
    const [showOverlay, setShowOverlay] = useState(null)
    const [energySaved, setEnergySaved] = useState(847.3)

    // Animated counter for energy saved
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergySaved(prev => +(prev + Math.random() * 0.05).toFixed(1))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            background: '#000000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Outfit', sans-serif",
            overflowX: 'hidden',
            position: 'relative'
        }}>
            {/* ── Background: Noise & Particles ── */}
            <div className="noise-texture" style={{ position: 'fixed', inset: 0, opacity: 0.05, pointerEvents: 'none', zIndex: 1 }} />
            <ParticleBackground />

            {/* ── Header ── */}
            <nav style={{
                padding: '32px 60px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: '#10B981', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 'bold', color: '#000',
                        fontSize: '18px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                    }}>E</div>
                    <span style={{ fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>
                        ENERGENT AI
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: '1px' }}>
                    <span className="nav-link cursor-pointer" onClick={() => navigate('/dashboard')}>DASHBOARD</span>
                    <span className="nav-link cursor-pointer" onClick={() => setShowOverlay('architecture')}>ARCHITECTURE</span>
                    <span className="nav-link cursor-pointer" onClick={() => setShowOverlay('documentation')}>DOCUMENTATION</span>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    className="btn-launch"
                    style={{
                        padding: '12px 24px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px',
                        fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s'
                    }}
                >
                    LAUNCH DASHBOARD
                </button>
            </nav>

            {/* ── Main Hero Section ─────────────────────────── */}
            <main style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '60px 24px 120px 24px',
                zIndex: 10,
                position: 'relative'
            }}>
                {/* Status Bar */}
                <div style={{
                    display: 'flex', gap: '24px', marginBottom: '40px',
                    fontSize: '11px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                        <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                        NOW MONITORING 1.4B+ PARAMS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', textShadow: '0 0 10px rgba(16,185,129,0.3)' }}>
                        ⚡ ENERGY SAVED TODAY: {energySaved} kWh
                    </div>
                </div>

                <div style={{ marginBottom: '16px', fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '3px' }}>
                    CRAFTED BY ALGO NINJAS
                </div>

                <h1 style={{
                    fontSize: '72px', fontWeight: 800, lineHeight: '1.1',
                    marginBottom: '32px', letterSpacing: '-2px', maxWidth: '1000px'
                }}>
                    Sustainable AI.<br />
                    Powered by <span className="shimmer-text">AMD Ryzen™ AI.</span>
                </h1>

                <p style={{
                    fontSize: '20px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6',
                    maxWidth: '800px', marginBottom: '60px', fontWeight: 400
                }}>
                    The definitive telemetry engine for energy-aware ML. Real-time power profiling, predictive optimization, and carbon auditing built specifically for XDNA™ architecture.
                </p>

                {/* 3D Visualization Placeholder Element */}
                <div style={{ width: '800px', height: '400px', position: 'relative', marginBottom: '60px' }}>
                    <NodeNetwork />
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        className="btn-primary-glow"
                        style={{
                            padding: '18px 48px', fontSize: '16px', fontWeight: 800,
                            borderRadius: '12px', background: '#10B981', color: '#fff',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        START RUNNING →
                    </button>
                    <button
                        className="btn-secondary-outline"
                        onClick={() => window.open('https://github.com/aiman/energent-ai', '_blank')}
                        style={{
                            padding: '18px 48px', fontSize: '16px', fontWeight: 800,
                            borderRadius: '12px', background: 'transparent', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', transition: 'all 0.3s'
                        }}
                    >
                        VIEW CODEBASE
                    </button>
                </div>
            </main>

            {/* ── Footer ── */}
            <footer style={{
                padding: '60px 24px',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                zIndex: 10,
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '2px', marginBottom: '32px' }}>
                    ARCHITECTED FOR SILICON INTELLIGENCE | © 2026 ALGO NINJAS
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', alignItems: 'center', opacity: 0.5 }}>
                    <span style={{ fontSize: '24px', fontWeight: 900 }}>AMD</span>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>ROCm™</span>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>XDNA™</span>
                    <span style={{ fontSize: '16px', fontWeight: 700 }}>Zen 5</span>
                </div>
            </footer>

            {showOverlay && (
                <TechOverlay type={showOverlay} onClose={() => setShowOverlay(null)} />
            )}

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;800;900&display=swap');
                
                .nav-link:hover { color: #fff; }
                .btn-launch:hover { background: rgba(255,255,255,0.1); border-color: rgba(16,185,129,0.3); box-shadow: 0 0 15px rgba(16,185,129,0.2); }
                
                .shimmer-text {
                    background: linear-gradient(90deg, #10B981, #3B82F6, #10B981);
                    background-size: 200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 3s linear infinite;
                }
                
                @keyframes shimmer {
                    to { background-position: 200% center; }
                }

                .btn-primary-glow:hover { transform: scale(1.05); box-shadow: 0 0 30px rgba(16,185,129,0.5); }
                .btn-secondary-outline:hover { border-color: #fff; box-shadow: 0 0 15px rgba(255,255,255,0.1); }
                
                .noise-texture {
                    background-image: url('https://grainy-gradients.vercel.app/noise.svg');
                    filter: contrast(150%) brightness(100%);
                }

                .glass-overlay {
                    backdrop-filter: blur(40px);
                    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
                
                .live-dot {
                    background: #10B981;
                    border-radius: 50%;
                    box-shadow: 0 0 10px #10B981;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse { 0% { transform: scale(0.95); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.8; } }
            `}</style>
        </div>
    )
}

function ParticleBackground() {
    const particles = Array.from({ length: 50 })
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
            {particles.map((_, i) => (
                <div key={i} className="particle" style={{
                    position: 'absolute',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    background: '#10B981',
                    borderRadius: '50%',
                    opacity: Math.random() * 0.4,
                    animation: `float-up ${Math.random() * 10 + 10}s linear infinite`,
                    animationDelay: `-${Math.random() * 10}s`
                }} />
            ))}
            <style>{`
                @keyframes float-up {
                    from { transform: translateY(100vh) scale(1); }
                    to { transform: translateY(-10vh) scale(0.5); }
                }
            `}</style>
        </div>
    )
}

function NodeNetwork() {
    const [nodes] = useState(() => Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 800,
        y: Math.random() * 400,
        color: i % 3 === 0 ? '#EF4444' : i % 2 === 0 ? '#F59E0B' : '#10B981',
        size: Math.random() * 10 + 5
    })))

    return (
        <svg width="800" height="400" viewBox="0 0 800 400" style={{ overflow: 'visible' }}>
            {/* Connection Lines */}
            {nodes.map((n1, i) =>
                nodes.slice(i + 1).map((n2, j) => {
                    const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2)
                    if (dist < 200) {
                        return (
                            <line key={`${i}-${j}`} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
                                stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        )
                    }
                    return null
                })
            )}

            {/* Particles flowing along lines simulation */}
            <circle r="2" fill="#10B981">
                <animateMotion
                    dur="3s" repeatCount="indefinite"
                    path="M 100 100 L 300 150 L 500 50 L 700 300"
                />
            </circle>
            <circle r="2" fill="#10B981">
                <animateMotion
                    dur="4s" repeatCount="indefinite"
                    path="M 600 50 L 400 300 L 100 200"
                />
            </circle>

            {/* Nodes */}
            {nodes.map(node => (
                <g key={node.id} style={{ animation: `pulse-node 4s infinite ${node.id * 0.2}s` }}>
                    <circle cx={node.x} cy={node.y} r={node.size} fill={node.color} opacity="0.6">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} />
                </g>
            ))}

            <style>{`
                @keyframes pulse-node {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </svg>
    )
}

function TechOverlay({ type, onClose }) {
    return (
        <div className="glass-overlay" style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '40px'
        }}>
            <div style={{
                width: '100%', maxWidth: '1200px', maxHeight: '90vh',
                background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 40px 100px rgba(0,0,0,0.8)'
            }}>
                <div style={{
                    padding: '24px 40px', borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    background: 'rgba(255,255,255,0.02)'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {type === 'architecture' ? 'System Pipeline Architecture' : 'Technical Documentation'}
                    </h2>
                    <button onClick={onClose} style={{
                        background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                        fontSize: '11px', fontWeight: 800
                    }}>CLOSE ESC</button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '40px' }}>
                    {type === 'architecture' ? <ArchitectureContent /> : <DocumentationContent />}
                </div>
            </div>
        </div>
    )
}

function ArchitectureContent() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }}>
            <div>
                <h3 style={{ color: '#10B981', fontSize: '13px', fontWeight: 900, marginBottom: '24px' }}>01 ── INTEGRATED PIPELINE</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <LayerCard title="UI & Visualization" tech="React 18 | Chart.js" desc="Real-time telemetry rendering and before/after comparison logic." />
                    <LayerCard title="Core Engine Layer" tech="FastAPI | ONNX | Carbon.io" desc="Inference orchestration, INT8 quantization, and carbon grid translation." />
                    <LayerCard title="Hardware Telemetry" tech="ROCm | RAPL | XDNA" desc="Direct silicon-level polling for GPU, CPU, and NPU power states." />
                </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '20px' }}>Logical Flow</h3>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '2' }}>
                    <div style={{ color: '#10B981' }}>[START] Subprocess Poll (rocm-smi)</div>
                    <div style={{ paddingLeft: '20px' }}>➜ Map Hardware Watts (float)</div>
                    <div style={{ paddingLeft: '20px' }}>➜ Aggregate total_energy_wh</div>
                    <div style={{ color: '#3b82f6' }}>➜ PUSH: WebSocket Stream (1Hz)</div>
                    <div style={{ paddingLeft: '40px' }}>➜ Dashboard: Update Power Spectrum</div>
                    <div style={{ paddingLeft: '40px' }}>➜ Dashboard: Render Optimal Path</div>
                    <div style={{ color: '#a78bfa' }}>➜ Optimization: Query Reference DB</div>
                    <div style={{ paddingLeft: '60px' }}>➜ Rank Suggestions by ROI</div>
                </div>
            </div>
        </div>
    )
}

function LayerCard({ title, tech, desc }) {
    return (
        <div style={{ padding: '24px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{tech}</div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>{title}</div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5' }}>{desc}</div>
        </div>
    )
}

function DocumentationContent() {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <DocSection title="API Endpoints" items={[
                { label: 'POST /api/run', val: 'Trigger workload with {model, target, precision}' },
                { label: 'GET /api/optimize', val: 'Returns ranked suggestions based on benchmark' },
                { label: 'WS /ws/power', val: 'Real-time telemetry stream (JSON)' }
            ]} />
            <DocSection title="Carbon Calculation" items={[
                { label: 'Formula', val: 'Energy(Wh) = Watts * (Time/3600)' },
                { label: 'Emissions', val: 'CO2(g) = Energy * Intensity (820g/kWh)' },
                { label: 'Context', val: 'Relatable metrics: KM driven, Tree Hours' }
            ]} />
            <DocSection title="Hardware Fallbacks" items={[
                { label: 'No GPU', val: 'Switch to TDP-utilization estimation' },
                { label: 'No NPU', val: 'Hide optimized pipeline or show simulated potential' },
                { label: 'API Down', val: 'Persistent cache of last electrical grid intensity' }
            ]} />
        </div>
    )
}

function DocSection({ title, items }) {
    return (
        <div>
            <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#10B981', marginBottom: '16px' }}>{title}</h3>
            {items.map((item, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{item.val}</div>
                </div>
            ))}
        </div>
    )
}
