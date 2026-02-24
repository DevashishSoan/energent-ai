import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export default function LandingPage() {
    const navigate = useNavigate()
    const [showOverlay, setShowOverlay] = useState(null)
    const [energySaved, setEnergySaved] = useState(847.3)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

    // Mouse tracking for parallax
    const handleMouseMove = (e) => {
        setMousePos({
            x: (e.clientX / window.innerWidth - 0.5) * 20,
            y: (e.clientY / window.innerHeight - 0.5) * 20
        })
    }

    // Animated counter for energy saved
    useEffect(() => {
        const interval = setInterval(() => {
            setEnergySaved(prev => +(prev + Math.random() * 0.05).toFixed(1))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div
            onMouseMove={handleMouseMove}
            style={{
                minHeight: '100vh',
                background: '#000000',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: "'Outfit', sans-serif",
                overflowX: 'hidden',
                position: 'relative',
                width: '100%'
            }}
        >
            {/* ── Background: Noise & Neural Flow Mesh ── */}
            <div className="noise-texture" style={{ position: 'fixed', inset: 0, opacity: 0.05, pointerEvents: 'none', zIndex: 1 }} />
            <NeuralBackground />

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
                    <span className="nav-link-animated cursor-pointer" onClick={() => navigate('/dashboard')}>DASHBOARD</span>
                    <span className="nav-link-animated cursor-pointer" onClick={() => setShowOverlay('architecture')}>ARCHITECTURE</span>
                    <span className="nav-link-animated cursor-pointer" onClick={() => setShowOverlay('documentation')}>DOCUMENTATION</span>
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
                padding: '80px 24px 120px 24px',
                zIndex: 10,
                position: 'relative',
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Floating Live Metrics Panel (Emotional Hook) - Fixed Positioning with Parallax */}
                <div style={{
                    position: 'absolute',
                    top: '80px',
                    right: '60px',
                    zIndex: 20,
                    transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
                    transition: 'transform 0.1s ease-out'
                }}>
                    <LiveMetricsPanel />
                </div>

                {/* Status Bar */}
                <div style={{
                    display: 'flex', gap: '24px', marginBottom: '32px',
                    fontSize: '11px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.8)' }}>
                        <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                        NOW MONITORING AI WORKLOADS
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', textShadow: '0 0 10px rgba(16,185,129,0.3)' }}>
                        ⚡ ENERGY SAVED: {energySaved} kWh
                    </div>
                </div>

                <div style={{ marginBottom: '12px', fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '3px' }}>
                    CRAFTED BY ALGO NINJAS
                </div>

                <h1 className="shimmer-text" style={{
                    fontSize: '80px', fontWeight: 800, lineHeight: '1.0',
                    marginBottom: '24px', letterSpacing: '-2.5px', maxWidth: '1100px'
                }}>
                    Sustainable AI.<br />
                    Powered by AMD Ryzen™ AI.
                </h1>

                <p style={{
                    fontSize: '24px', color: '#fff', lineHeight: '1.4',
                    maxWidth: '850px', marginBottom: '16px', fontWeight: 800
                }}>
                    Reduce AI energy cost by <span style={{ color: '#10B981' }}>30%</span> with real-time optimization.
                </p>
                <p style={{
                    fontSize: '18px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6',
                    maxWidth: '700px', marginBottom: '60px', fontWeight: 400
                }}>
                    Telemetry engine for energy-aware ML, built for XDNA™<br />
                    architecture and high-efficiency Ryzen AI NPUs.
                </p>

                {/* Center Visualization */}
                <div style={{ width: '800px', height: '360px', position: 'relative', marginBottom: '60px' }}>
                    <NodeNetwork />
                </div>

                {/* CTAs */}
                <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                    {/* Primary Button Anchor Glow */}
                    <div style={{
                        position: 'absolute', width: '200px', height: '100px',
                        background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)',
                        left: '-20px', top: '-10px', pointerEvents: 'none', filter: 'blur(20px)'
                    }} />

                    <button
                        className="btn-primary-glow"
                        style={{
                            padding: '18px 48px', fontSize: '16px', fontWeight: 800,
                            borderRadius: '12px', background: '#10B981', color: '#fff',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                            position: 'relative', zIndex: 1
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
                
                .nav-link-animated {
                    position: relative;
                    transition: color 0.3s ease;
                }
                .nav-link-animated::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 0;
                    height: 1px;
                    background: #10B981;
                    transition: width 0.3s ease;
                    box-shadow: 0 0 8px #10B981;
                }
                .nav-link-animated:hover {
                    color: #fff;
                }
                .nav-link-animated:hover::after {
                    width: 100%;
                }

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

function NeuralBackground() {
    const nodes = useRef(Array.from({ length: 40 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 10 + 20
    })))

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.2 }}>
            <svg width="100%" height="100%" style={{ position: 'absolute' }}>
                {nodes.current.map((node, i) => (
                    <g key={i}>
                        <circle className="neural-node" cx={`${node.x}%`} cy={`${node.y}%`} r={node.size} fill="#10B981" />
                        {/* Data flowing toward the panel (Top Right) */}
                        {i % 5 === 0 && (
                            <circle r="1" fill="#10B981" className="data-packet">
                                <animate
                                    attributeName="cx"
                                    from={`${node.x}%`} to="90%"
                                    dur={`${Math.random() * 4 + 2}s`}
                                    repeatCount="indefinite"
                                />
                                <animate
                                    attributeName="cy"
                                    from={`${node.y}%`} to="15%"
                                    dur={`${Math.random() * 4 + 2}s`}
                                    repeatCount="indefinite"
                                />
                                <animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite" />
                            </circle>
                        )}
                        {/* Faint connecting lines based on proximity (simulated with CSS lines) */}
                        {i % 4 === 0 && (
                            <line
                                x1={`${node.x}%`} y1={`${node.y}%`}
                                x2={`${node.x + 10}%`} y2={`${node.y + 10}%`}
                                stroke="rgba(16,185,129,0.1)" strokeWidth="0.5"
                            />
                        )}
                    </g>
                ))}
            </svg>
            <style>{`
                .neural-node {
                    animation: neural-pulse 4s infinite ease-in-out;
                }
                @keyframes neural-pulse {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.5); }
                }
                .data-packet {
                    filter: blur(1px);
                    box-shadow: 0 0 5px #10B981;
                }
            `}</style>
        </div>
    )
}

function LiveMetricsPanel() {
    const [efficiency, setEfficiency] = useState(88.4)
    const [offset, setOffset] = useState(3.8)

    useEffect(() => {
        const interval = setInterval(() => {
            setEfficiency(prev => +(85 + Math.random() * 10).toFixed(1))
            // Slow, realistic increment for CO2 offset
            setOffset(prev => +(prev + 0.01).toFixed(2))
        }, 2000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div style={{
            width: '260px',
            background: 'rgba(5,5,5,0.85)',
            border: '1px solid rgba(16,185,129,0.5)',
            borderRadius: '24px',
            padding: '24px',
            textAlign: 'left',
            boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(16,185,129,0.15)',
            backdropFilter: 'blur(20px)',
            animation: 'panel-float 8s infinite ease-in-out',
            transformStyle: 'preserve-3d'
        }}>
            <div style={{ fontSize: '10px', color: '#10B981', fontWeight: 900, letterSpacing: '1.5px', marginBottom: '16px', textTransform: 'uppercase' }}>
                REAL-TIME TELEMETRY
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>NPU Efficiency</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span style={{ fontSize: '28px', fontWeight: 800 }}>{efficiency}%</span>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>▲ 12%</span>
                </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>CO2 Offset</div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{offset}g</div>
            </div>

            {/* Moving Waveform with Pulse */}
            <div style={{ height: '40px', overflow: 'hidden', position: 'relative', marginTop: '10px' }}>
                <svg width="210" height="40" viewBox="0 0 210 40">
                    <path
                        d="M0 20 Q 25 5, 50 20 T 100 20 T 150 20 T 210 20"
                        fill="none" stroke="#10B981" strokeWidth="2.5"
                        className="waveform-living"
                    />
                </svg>
            </div>

            <style>{`
                @keyframes panel-float {
                    0%, 100% { transform: translateY(0) rotateX(2deg) rotateY(-2deg); }
                    50% { transform: translateY(-15px) rotateX(-2deg) rotateY(2deg); }
                }
                .waveform-living {
                    stroke-dasharray: 210;
                    stroke-dashoffset: 210;
                    animation: wave-flow 2.5s infinite linear, wave-pulse 2s infinite ease-in-out;
                    filter: drop-shadow(0 0 5px rgba(16,185,129,0.5));
                }
                @keyframes wave-flow {
                    from { stroke-dashoffset: 420; }
                    to { stroke-dashoffset: 0; }
                }
                @keyframes wave-pulse {
                    0%, 100% { stroke-opacity: 0.6; stroke-width: 2; }
                    50% { stroke-opacity: 1; stroke-width: 3.5; }
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
                                stroke="rgba(16,185,129,0.1)" strokeWidth="1" />
                        )
                    }
                    return null
                })
            )}

            {/* Particles flowing along lines simulation */}
            <circle r="3" fill="#10B981" filter="blur(2px)">
                <animateMotion
                    dur="3s" repeatCount="indefinite"
                    path="M 100 100 L 300 150 L 500 50 L 700 300"
                />
            </circle>
            <circle r="3" fill="#10B981" filter="blur(2px)">
                <animateMotion
                    dur="5s" repeatCount="indefinite"
                    path="M 600 50 L 400 300 L 100 200"
                />
            </circle>

            {/* Nodes */}
            {nodes.map(node => (
                <g key={node.id}>
                    <circle cx={node.x} cy={node.y} r={node.size} fill={node.color} opacity="0.6">
                        <animate attributeName="opacity" values="0.2;0.6;0.2" dur="4s" repeatCount="indefinite" />
                    </circle>
                    <circle cx={node.x} cy={node.y} r={node.size / 2} fill={node.color} />
                </g>
            ))}
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
