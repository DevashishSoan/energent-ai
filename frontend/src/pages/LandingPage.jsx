import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const TERMINAL_LOGS = [
    { time: '00:00:00', type: 'INFO', msg: 'System Architect: ALGO NINJAS' },
    { time: '00:00:01', type: 'INFO', msg: 'Initializing Energent Neural Engine...' },
    { time: '00:00:02', type: 'INFO', msg: 'Detecting hardware: AMD Ryzen AI 9 HX 370' },
    { time: '00:00:02', type: 'SUCCESS', msg: 'NPU Core detected (50 TOPS) - ACTIVE' },
    { time: '00:00:03', type: 'INFO', msg: 'Connecting to power telemetry sensors...' },
    { time: '00:00:03', type: 'DATA', msg: 'GPU Power: 15.2W | CPU Power: 22.1W' },
    { time: '00:00:04', type: 'WARN', msg: 'High energy consumption detected on process [PID:892]' },
    { time: '00:00:04', type: 'ACTION', msg: 'Optimizing... Switching dispatch to NPU' },
    { time: '00:00:05', type: 'SUCCESS', msg: 'Power reduced by 82% (12.4W saved)' },
    { time: '00:00:05', type: 'INFO', msg: 'Calculating carbon footprint...' },
    { time: '00:00:06', type: 'DATA', msg: 'Grid Intensity: 420g/kWh (Coal)' },
    { time: '00:00:06', type: 'INFO', msg: 'Session secured: Energent AI v1.0.2' },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const [logs, setLogs] = useState([])
    const [showOverlay, setShowOverlay] = useState(null) // 'architecture' | 'documentation'

    const indexRef = useRef(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        indexRef.current = 0
        setLogs([])

        intervalRef.current = setInterval(() => {
            if (indexRef.current >= TERMINAL_LOGS.length) {
                indexRef.current = 0
                setLogs([])
                return
            }
            const entry = TERMINAL_LOGS[indexRef.current]
            if (entry) setLogs(prev => [...prev, entry])
            indexRef.current++
        }, 800)

        return () => {
            clearInterval(intervalRef.current)
            intervalRef.current = null
        }
    }, [])

    return (
        <div style={{
            minHeight: '100vh',
            background: '#020202',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "'Inter', sans-serif",
            overflowX: 'hidden'
        }}>
            {/* ── Background: Cyber Grid & Glows ── */}
            <div className="bg-grid-animate" style={{ position: 'fixed', inset: 0, opacity: 0.15, zIndex: 0 }} />

            <div style={{
                position: 'fixed', top: '-10%', left: '10%', width: '800px', height: '800px',
                background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
                filter: 'blur(100px)', pointerEvents: 'none', zIndex: 0
            }} />

            <div style={{
                position: 'fixed', bottom: '-20%', right: '-10%', width: '900px', height: '900px',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                filter: 'blur(120px)', pointerEvents: 'none', zIndex: 0
            }} />

            {/* ── Navigation ── */}
            <nav style={{
                padding: '32px 60px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, position: 'relative'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'var(--optimal)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontWeight: 'bold', color: '#000',
                        fontSize: '18px', boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)'
                    }}>E</div>
                    <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-1px', textTransform: 'uppercase' }}>
                        Energent <span style={{ color: 'var(--optimal)' }}>AI</span>
                    </span>
                </div>

                <div style={{ display: 'flex', gap: '40px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 700, letterSpacing: '1px' }}>
                    <span className="nav-link cursor-pointer" onClick={() => navigate('/dashboard')}>DASHBOARD</span>
                    <span className="nav-link cursor-pointer" onClick={() => setShowOverlay('architecture')}>ARCHITECTURE</span>
                    <span className="nav-link cursor-pointer" onClick={() => setShowOverlay('documentation')}>DOCUMENTATION</span>
                </div>

                <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                        padding: '10px 24px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '13px',
                        fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    className="btn-hover-glow"
                >
                    LAUNCH CONSOLE
                </button>
            </nav>

            {/* ── Hero Section ─────────────────────────── */}
            <main style={{
                flex: 1,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '120px 24px',
                zIndex: 10,
                position: 'relative'
            }}>
                {/* Badge */}
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '32px'
                }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', borderRadius: '100px',
                        background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)',
                        fontSize: '11px', fontWeight: 900, color: 'var(--optimal)',
                        letterSpacing: '2px', textTransform: 'uppercase'
                    }}>
                        <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                        Now Monitoring 1.4B+ Params
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 900, color: 'rgba(255,255,255,0.4)', letterSpacing: '3px', textTransform: 'uppercase' }}>
                        CRAFTED BY <span style={{ color: '#fff' }}>ALGO NINJAS</span>
                    </div>
                </div>

                <h1 style={{
                    fontSize: '84px', fontWeight: 900, lineHeight: '0.95',
                    marginBottom: '32px', letterSpacing: '-4px', maxWidth: '1000px'
                }}>
                    Sustainable AI. <br />
                    Powered by <span style={{
                        background: 'linear-gradient(to right, #10B981, #3B82F6)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>AMD Ryzen™ AI.</span>
                </h1>

                <p style={{
                    fontSize: '22px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.5',
                    maxWidth: '700px', marginBottom: '48px', fontWeight: 500
                }}>
                    The definitive telemetry engine for energy-aware ML.
                    Real-time power profiling, predictive optimization, and carbon auditing
                    built specifically for XDNA™ architecture.
                </p>

                <div style={{ display: 'flex', gap: '20px' }}>
                    <button
                        className="btn-primary"
                        style={{
                            padding: '20px 56px', fontSize: '18px', fontWeight: 800,
                            borderRadius: '12px', background: 'var(--optimal)', color: '#000',
                            boxShadow: '0 10px 40px rgba(16, 185, 129, 0.25)', border: 'none'
                        }}
                        onClick={() => navigate('/dashboard')}
                    >
                        START RUNNING →
                    </button>
                    <button
                        onClick={() => window.open('https://github.com/aiman/energent-ai', '_blank')}
                        style={{
                            padding: '20px 40px', fontSize: '18px', fontWeight: 800,
                            borderRadius: '12px', background: 'transparent', color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
                        }}
                    >
                        VIEW CODEBASE
                    </button>
                </div>

                {/* Dashboard Preview / Terminal Container */}
                <div style={{
                    marginTop: '100px', width: '100%', maxWidth: '1100px',
                    perspective: '1000px', position: 'relative'
                }}>
                    <div className="glass-card" style={{
                        height: '460px',
                        background: 'rgba(10,10,10,0.8)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 40px 100px rgba(0,0,0,0.8)',
                        padding: '0',
                        overflow: 'hidden',
                        display: 'flex', flexDirection: 'column',
                        transform: 'rotateX(5deg)',
                        opacity: 0.95
                    }}>
                        {/* Fake Console Interface */}
                        <div style={{
                            padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }} />
                                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }} />
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace' }}>
                                ENERGENT_TELEMETRY_LOGS.EXE
                            </div>
                            <div style={{ width: '40px' }} />
                        </div>

                        <div style={{
                            padding: '32px', flex: 1, fontFamily: 'monospace', fontSize: '14px',
                            overflow: 'hidden', color: '#888', lineHeight: '1.8', textAlign: 'left'
                        }}>
                            {logs.map((log, i) => (
                                <div key={i} style={{
                                    marginBottom: '6px', borderLeft: `2px solid ${log.type === 'SUCCESS' ? 'var(--optimal)' :
                                        log.type === 'WARN' ? '#f59e0b' :
                                            log.type === 'INFO' ? '#3b82f6' : 'transparent'}`, paddingLeft: '16px'
                                }}>
                                    <span style={{ color: 'rgba(255,255,255,0.2)' }}>[{log.time}]</span>{' '}
                                    <span style={{
                                        color: log.type === 'INFO' ? '#3b82f6' :
                                            log.type === 'SUCCESS' ? 'var(--optimal)' :
                                                log.type === 'WARN' ? '#f59e0b' :
                                                    log.type === 'ACTION' ? '#a78bfa' : '#fff',
                                        fontWeight: 'bold', textTransform: 'uppercase', fontSize: '11px'
                                    }}>
                                        {log.type}
                                    </span>{' '}
                                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>{log.msg}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: '12px' }}>
                                <span style={{ color: 'var(--optimal)' }}>➜</span> <span className="cursor-blink">_</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Elements */}
                    <div style={{
                        position: 'absolute', top: '50%', left: '-80px', width: '200px', height: '1px',
                        background: 'linear-gradient(to right, transparent, var(--optimal))', opacity: 0.3
                    }} />
                    <div style={{
                        position: 'absolute', top: '50%', right: '-80px', width: '200px', height: '1px',
                        background: 'linear-gradient(to left, transparent, var(--optimal))', opacity: 0.3
                    }} />
                </div>
            </main>

            {/* ── Marquee Footer ── */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)', padding: '60px 0',
                background: 'rgba(0,0,0,0.5)', zIndex: 10
            }}>
                <div style={{
                    maxWidth: '1200px', margin: '0 auto', textAlign: 'center'
                }}>
                    <div style={{
                        fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 900,
                        letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px'
                    }}>
                        Architected for Silicon Intelligence | © 2026 ALGO NINJAS
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '80px', alignItems: 'center',
                        opacity: 0.4, filter: 'grayscale(1) brightness(2)'
                    }}>
                        <span style={{ fontWeight: 950, fontSize: '32px', letterSpacing: '-2px' }}>AMD</span>
                        <span style={{ fontWeight: 800, fontSize: '24px' }}>ROCm™</span>
                        <span style={{ fontWeight: 800, fontSize: '24px' }}>XDNA™</span>
                        <span style={{ fontWeight: 800, fontSize: '24px' }}>Zen 5</span>
                    </div>
                </div>
            </div>

            {showOverlay && (
                <TechOverlay type={showOverlay} onClose={() => setShowOverlay(null)} />
            )}

            <style>{`
                .nav-link:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
                .btn-hover-glow:hover { background: rgba(255,255,255,0.1); transform: translateY(-1px); border-color: rgba(255,255,255,0.3); }
                .cursor-blink { animation: blink 1s step-end infinite; color: var(--optimal); }
                @keyframes blink { 50% { opacity: 0; } }
                .bg-grid-animate {
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
                    background-size: 40px 40px;
                }
                .glass-overlay {
                    backdrop-filter: blur(20px);
                    animation: fadeIn 0.3s ease-out;
                }
                @keyframes fadeIn { from { opacity: 0; transform: scale(1.02); } to { opacity: 1; transform: scale(1); } }
            `}</style>
        </div>
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
                <h3 style={{ color: 'var(--optimal)', fontSize: '13px', fontWeight: 900, marginBottom: '24px' }}>01 ── INTEGRATED PIPELINE</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <LayerCard title="UI & Visualization" tech="React 18 | Chart.js" desc="Real-time telemetry rendering and before/after comparison logic." />
                    <LayerCard title="Core Engine Layer" tech="FastAPI | ONNX | Carbon.io" desc="Inference orchestration, INT8 quantization, and carbon grid translation." />
                    <LayerCard title="Hardware Telemetry" tech="ROCm | RAPL | XDNA" desc="Direct silicon-level polling for GPU, CPU, and NPU power states." />
                </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '32px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '20px' }}>Logical Flow</h3>
                <div style={{ fontFamily: 'monospace', fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: '2' }}>
                    <div style={{ color: 'var(--optimal)' }}>[START] Subprocess Poll (rocm-smi)</div>
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
            <h3 style={{ fontSize: '14px', fontWeight: 900, color: 'var(--optimal)', marginBottom: '16px' }}>{title}</h3>
            {items.map((item, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.4)' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#fff', fontWeight: 600 }}>{item.val}</div>
                </div>
            ))}
        </div>
    )
}
