import React, { useMemo } from 'react'

/**
 * TopologyFlow: A premium enterprise SVG-based flow visualizer
 * Upgraded to 10/10 Hero Branding with Neural Routing & Pulse Effects
 */
export default function TopologyFlow({ latest, connected }) {
    const gpuWatts = latest?.gpu_watts || 0
    const cpuWatts = latest?.cpu_watts || 0
    const npuWatts = latest?.npu_watts || 0
    const totalWatts = gpuWatts + cpuWatts + npuWatts

    // Normalize weights (2 to 6 range for Hero active feel)
    const getWeight = (w) => (totalWatts > 0 ? (w / totalWatts) * 5 + 2 : 2)

    const gpuWeight = getWeight(gpuWatts)
    const cpuWeight = getWeight(cpuWatts)
    const npuWeight = getWeight(npuWatts)

    const getFlowSpeed = (w) => {
        if (!connected || w === 0) return '0s'
        const speed = Math.max(0.6, 3.5 - (w / 80))
        return `${speed.toFixed(2)}s`
    }

    return (
        <div className="glass-card" style={{
            padding: '28px', height: '100%', minHeight: '380px',
            display: 'flex', flexDirection: 'column',
            background: 'radial-gradient(circle at top right, rgba(16, 185, 129, 0.05), transparent)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
                        boxShadow: '0 0 15px rgba(16, 185, 129, 0.1)'
                    }}>🧬</div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            Neural Routing
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#fff', letterSpacing: '-0.3px' }}>
                            Energy Topology Pipeline
                        </div>
                    </div>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 900, color: connected ? 'var(--optimal)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px 12px', borderRadius: '20px', border: '1px solid var(--border-muted)' }}>
                    <div className="live-dot" style={{ opacity: connected ? 1 : 0.3 }} />
                    {connected ? 'CORE FEED ACTIVE' : 'DISCONNECTED'}
                </div>
            </div>

            <div style={{ flex: 1, padding: '0 10px', position: 'relative' }}>
                <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="flow-grad-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(16, 185, 129, 0.1)" />
                            <stop offset="100%" stopColor="var(--optimal)" />
                        </linearGradient>
                        <linearGradient id="flow-grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
                            <stop offset="100%" stopColor="var(--info)" />
                        </linearGradient>
                    </defs>

                    {/* Entry Node */}
                    <rect x="30" y="90" width="20" height="20" rx="4" fill="var(--bg-surface-elevated)" stroke="var(--border-muted)" strokeWidth="1" />
                    <circle cx="40" cy="100" r="3" fill="var(--optimal)" filter="url(#glow)" className="pulse" />
                    <text x="40" y="80" fontSize="8" fill="var(--text-muted)" textAnchor="middle" fontWeight="900" letterSpacing="1px">DISTRIBUTION</text>

                    {/* Path Definitions (Shared) */}
                    <path id="path-gpu" d="M 50,100 C 130,100 130,40 200,40" fill="none" />
                    <path id="path-cpu" d="M 50,100 C 130,100 130,100 200,100" fill="none" />
                    <path id="path-npu" d="M 50,100 C 130,100 130,160 200,160" fill="none" />

                    {/* Base Pipelines */}
                    <use href="#path-gpu" stroke="var(--border-muted)" strokeWidth={gpuWeight + 1} strokeLinecap="round" opacity="0.4" />
                    <use href="#path-cpu" stroke="var(--border-muted)" strokeWidth={cpuWeight + 1} strokeLinecap="round" opacity="0.2" />
                    <use href="#path-npu" stroke="var(--border-muted)" strokeWidth={npuWeight + 1} strokeLinecap="round" opacity="0.4" />

                    {/* Active Flows */}
                    <use href="#path-gpu" stroke="url(#flow-grad-blue)" strokeWidth={gpuWeight} strokeDasharray="6,20" className="flow-animate" style={{ animationDuration: getFlowSpeed(gpuWatts) }} />
                    <use href="#path-cpu" stroke="var(--text-tertiary)" strokeWidth={cpuWeight} strokeDasharray="6,20" className="flow-animate" style={{ animationDuration: getFlowSpeed(cpuWatts), opacity: 0.3 }} />
                    <use href="#path-npu" stroke="url(#flow-grad-emerald)" strokeWidth={npuWeight} strokeDasharray="6,20" className="flow-animate" style={{ animationDuration: getFlowSpeed(npuWatts) }} />

                    {/* Neural Particles (The visual "Punch") */}
                    {connected && gpuWatts > 1 && (
                        <circle r="3" fill="var(--info)" filter="url(#glow)">
                            <animateMotion dur={getFlowSpeed(gpuWatts)} repeatCount="indefinite" path="M 50,100 C 130,100 130,40 200,40" />
                        </circle>
                    )}
                    {connected && cpuWatts > 1 && (
                        <circle r="3" fill="var(--text-secondary)" filter="url(#glow)">
                            <animateMotion dur={getFlowSpeed(cpuWatts)} repeatCount="indefinite" path="M 50,100 C 130,100 130,100 200,100" />
                        </circle>
                    )}
                    {connected && npuWatts > 0.1 && (
                        <circle r="3" fill="var(--optimal)" filter="url(#glow)">
                            <animateMotion dur={getFlowSpeed(npuWatts)} repeatCount="indefinite" path="M 50,100 C 130,100 130,160 200,160" />
                        </circle>
                    )}

                    {/* Component Nodes */}
                    <g transform="translate(200,0)">
                        {/* GPU Node */}
                        <rect x="0" y="30" width="20" height="20" rx="5" fill="var(--bg-surface-elevated)" stroke="var(--info)" strokeWidth="1.5" />
                        <circle cx="10" cy="40" r="3" fill="var(--info)" opacity={gpuWatts > 0 ? 1 : 0.2} filter={gpuWatts > 0 ? "url(#glow)" : ""} className={gpuWatts > 40 ? "pulse" : ""} />
                        <text x="28" y="44" fontSize="11" fill="#fff" fontWeight="900" letterSpacing="-0.2px">GPU <tspan fill="var(--text-muted)" fontWeight="600" className="mono" dy="-0.5">{gpuWatts?.toFixed(1)}W</tspan></text>

                        {/* CPU Node */}
                        <rect x="0" y="90" width="20" height="20" rx="5" fill="var(--bg-surface-elevated)" stroke="var(--text-tertiary)" strokeWidth="1.5" />
                        <circle cx="10" cy="100" r="3" fill="var(--text-tertiary)" opacity={cpuWatts > 0 ? 1 : 0.2} />
                        <text x="28" y="104" fontSize="11" fill="#fff" fontWeight="900" letterSpacing="-0.2px">CPU <tspan fill="var(--text-muted)" fontWeight="600" className="mono" dy="-0.5">{cpuWatts?.toFixed(1)}W</tspan></text>

                        {/* NPU Node */}
                        <rect x="0" y="150" width="20" height="20" rx="5" fill="var(--bg-surface-elevated)" stroke="var(--optimal)" strokeWidth="1.5" />
                        <circle cx="10" cy="160" r="3" fill="var(--optimal)" opacity={npuWatts > 0 ? 1 : 0.2} filter={npuWatts > 0 ? "url(#glow)" : ""} className={npuWatts > 0 ? "pulse" : ""} />
                        <text x="28" y="164" fontSize="11" fill="#fff" fontWeight="900" letterSpacing="-0.2px">RYZEN AI <tspan fill="var(--optimal)" fontWeight="900" className="mono" dy="-0.5">PEAK</tspan></text>
                    </g>
                </svg>
            </div>

            {/* Technical Metadata */}
            <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid var(--border-muted)', paddingTop: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Load Factor</div>
                    <div className="mono" style={{ fontSize: '14px', fontWeight: 900, color: 'var(--text-secondary)' }}>
                        {(totalWatts / 60 * 100).toFixed(1)}%
                    </div>
                </div>
                <div style={{ width: '1px', background: 'var(--border-muted)' }} />
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '8px', color: 'var(--text-muted)', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Efficiency Mode</div>
                    <div className="mono" style={{ fontSize: '14px', fontWeight: 900, color: 'var(--optimal)' }}>
                        NEURAL OPT.
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .flow-animate {
                    animation: flow-dash linear infinite;
                }
                @keyframes flow-dash {
                    to { stroke-dashoffset: -32; }
                }
                .pulse {
                    animation: node-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }
                @keyframes node-pulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.6; transform: scale(1.2); }
                }
            `}} />
        </div>
    )
}
