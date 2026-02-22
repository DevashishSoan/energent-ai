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
    { time: '00:00:05', type: 'SUCCESS', msg: 'Power reduced by 38% (12.4W saved)' },
    { time: '00:00:05', type: 'INFO', msg: 'Calculating carbon footprint...' },
    { time: '00:00:06', type: 'DATA', msg: 'Grid Intensity: 420g/kWh (Coal)' },
    { time: '00:00:06', type: 'INFO', msg: 'Session secured: Energent AI v1.0.2' },
]

export default function LandingPage() {
    const navigate = useNavigate()
    const [logs, setLogs] = useState([])

    // useRef for index + interval so StrictMode double-mount never creates two racing intervals
    const indexRef = useRef(0)
    const intervalRef = useRef(null)

    useEffect(() => {
        indexRef.current = 0
        setLogs([])

        intervalRef.current = setInterval(() => {
            if (indexRef.current >= TERMINAL_LOGS.length) {
                indexRef.current = 0
                setLogs([])   // reset — next tick begins fresh push
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
            background: '#050505',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Inter, sans-serif',
            overflowX: 'hidden'
        }}>

            {/* ── Background: Digital Nervous System ── */}
            <div className="bg-grid-animate" style={{ position: 'fixed', inset: 0, opacity: 0.2, zIndex: 0 }} />
            <div style={{
                position: 'fixed', top: '20%', right: '-10%', width: '600px', height: '600px',
                background: 'radial-gradient(circle, rgba(0,255,136,0.15) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0
            }} className="animate-float" />

            {/* ── Header ── */}
            <header style={{
                padding: '24px 40px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                zIndex: 10, backdropFilter: 'blur(5px)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '20px', filter: 'drop-shadow(0 0 8px rgba(0,255,136,0.5))' }}>⚡</span>
                    <span style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '-0.8px', textTransform: 'uppercase' }}>
                        Energent <span style={{ color: '#00ff88' }}>AI</span>
                    </span>
                </div>
                <div style={{ display: 'flex', gap: '32px', fontSize: '14px', color: '#999', fontWeight: 500 }}>
                    <span className="cursor-pointer hover:text-white transition-colors">Features</span>
                    <span className="cursor-pointer hover:text-white transition-colors">How it Works</span>
                    <span className="cursor-pointer hover:text-white transition-colors">GitHub</span>
                </div>
            </header>

            {/* ── Main Hero Section ── */}
            <main style={{
                flex: 1,
                display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
                gap: '64px',
                padding: '0 80px',
                alignItems: 'center',
                zIndex: 10,
                maxWidth: '1600px',
                margin: '0 auto',
                width: '100%'
            }}>

                {/* Left: Copy & CTA */}
                <div style={{ textAlign: 'left' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '6px 16px', borderRadius: '100px',
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        fontSize: '12px', fontWeight: 600, color: '#00ff88', marginBottom: '24px',
                        letterSpacing: '0.5px'
                    }}>
                        🟢 LIVE MONITORING ACTIVE
                    </div>

                    <h1 style={{
                        fontSize: '64px', fontWeight: 800, lineHeight: '1.1',
                        marginBottom: '24px', letterSpacing: '-2px'
                    }}>
                        Measure and reduce<br />
                        <span className="text-glow-green" style={{ color: '#00ff88' }}>AI energy usage</span><br />
                        in real time.
                    </h1>

                    <p style={{
                        fontSize: '20px', color: '#fff', opacity: 0.8, lineHeight: '1.6',
                        maxWidth: '540px', marginBottom: '40px'
                    }}>
                        The first telemetry tool for AMD Ryzen™ AI. Optimize your models for performance and planet.
                    </p>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <button
                            className="btn-primary"
                            style={{
                                padding: '20px 48px', fontSize: '18px',
                                boxShadow: '0 8px 32px rgba(0,255,136,0.3)'
                            }}
                            onClick={() => navigate('/dashboard')}
                        >
                            Start Reducing Emissions →
                        </button>
                    </div>
                </div>

                {/* Right: Live Terminal Visual */}
                <div className="card" style={{
                    height: '500px',
                    background: '#0a0a0a',
                    border: '1px solid #222',
                    boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                    padding: '0',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column'
                }}>
                    {/* Terminal Header */}
                    <div style={{
                        padding: '12px 20px', background: '#111', borderBottom: '1px solid #222',
                        display: 'flex', gap: '8px', alignItems: 'center'
                    }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }} />
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }} />
                        <div style={{ marginLeft: '12px', fontSize: '12px', color: '#666', fontFamily: 'monospace' }}>
                            energent-cli — monitoring
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div style={{
                        padding: '24px', flex: 1, fontFamily: 'JetBrains Mono, monospace', fontSize: '13px',
                        overflow: 'hidden', color: '#ccc', lineHeight: '1.8'
                    }}>
                        {logs.filter(Boolean).map((log, i) => (
                            <div key={i} style={{ marginBottom: '4px' }}>
                                <span style={{ color: '#555' }}>[{log.time}]</span>{' '}
                                <span style={{
                                    color: log.type === 'INFO' ? '#3b82f6' :
                                        log.type === 'SUCCESS' ? '#00ff88' :
                                            log.type === 'WARN' ? '#f59e0b' :
                                                log.type === 'ACTION' ? '#a78bfa' : '#fff',
                                    fontWeight: 'bold'
                                }}>
                                    {log.type}
                                </span>{' '}
                                {log.msg}
                            </div>
                        ))}
                        <div style={{ marginTop: '4px' }}>
                            <span style={{ color: '#00ff88' }}>➜</span> <span className="cursor-blink">_</span>
                        </div>
                    </div>
                </div>

            </main>

            {/* ── Footer Bar: Marquee ── */}
            <div style={{
                borderTop: '1px solid rgba(255,255,255,0.05)', padding: '32px 0',
                marginTop: 'auto', background: 'rgba(0,0,0,0.3)',
                overflow: 'hidden'
            }}>
                <div style={{
                    maxWidth: '1600px', margin: '0 auto', padding: '0 40px',
                    display: 'flex', flexDirection: 'column', gap: '20px'
                }}>
                    <div style={{ fontSize: '10px', color: '#444', fontWeight: 700, letterSpacing: '2px', textAlign: 'center', textTransform: 'uppercase' }}>
                        Trusted by the next generation of AI developers
                    </div>
                    <div style={{
                        display: 'flex', justifyContent: 'center', gap: '64px', alignItems: 'center',
                        opacity: 0.5, filter: 'grayscale(1)'
                    }}>
                        <div style={{ color: '#fff', fontWeight: 950, fontSize: '24px', letterSpacing: '-1.5px' }}>AMD</div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>Hugging Face</div>
                        <div style={{ color: '#fff', fontWeight: 900, fontSize: '22px', letterSpacing: '-0.5px' }}>PyTorch</div>
                        <div style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>Mistral AI</div>
                        <div style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>LangChain</div>
                    </div>
                </div>
            </div>

        </div>
    )
}
