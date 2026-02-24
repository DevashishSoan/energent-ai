import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

const TERMINAL_LOGS = [
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
                    <span className="nav-link cursor-pointer">ARCHITECTURE</span>
                    <span className="nav-link cursor-pointer">DOCUMENTATION</span>
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
                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                    padding: '8px 16px', borderRadius: '100px',
                    background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)',
                    fontSize: '11px', fontWeight: 900, color: 'var(--optimal)', marginBottom: '32px',
                    letterSpacing: '2px', textTransform: 'uppercase'
                }}>
                    <span className="live-dot" style={{ width: '8px', height: '8px' }} />
                    Now Monitoring 1.4B+ Params
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
                        Architected for Silicon Intelligence
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
            `}</style>
        </div>
    )
}
