import { useState, useEffect } from 'react'
import API from '../config.js'

export default function WorkloadsView() {
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(API.history)
            .then(r => {
                if (!r.ok) throw new Error('Failed to retrieve telemetry archive')
                return r.json()
            })
            .then(data => {
                setHistory(data)
                setError(null)
            })
            .catch(err => {
                console.error(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <div style={{ textAlign: 'center' }}>
                <div className="live-dot" style={{ margin: '0 auto 16px', width: '12px', height: '12px' }} />
                <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: 900, letterSpacing: '2px' }}>
                    SYNCHRONIZING TELEMETRY ARCHIVE...
                </div>
            </div>
        </div>
    )

    return (
        <div className="fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <span className="badge-low" style={{ padding: '4px 10px', fontSize: '10px', fontWeight: 900, borderRadius: '4px' }}>ENTERPRISE COMPLIANCE</span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--border-muted)' }} />
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>AUTO-SAVED AT 1S INTERVALS</span>
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: 800, color: '#fff', letterSpacing: '-1px', marginBottom: '12px' }}>
                    Workload Telemetry Archive
                </h1>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '700px' }}>
                    Access the complete historical record of energy profiles across your AI infrastructure. Use these metrics to generate sustainability reports and track carbon reduction targets over time.
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                <div className="glass-premium" style={{ padding: '24px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Total Archived Runs</div>
                    <div className="mono" style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>{history.length}</div>
                </div>
                <div className="glass-premium" style={{ padding: '24px', borderLeft: '3px solid var(--optimal)' }}>
                    <div style={{ fontSize: '10px', color: 'var(--optimal)', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Efficiency Leader</div>
                    <div style={{ fontSize: '24px', fontWeight: 800, color: '#fff' }}>AMD NPU Cluster</div>
                </div>
                <div className="glass-premium" style={{ padding: '24px' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>Carbon Saved Today</div>
                    <div className="mono" style={{ fontSize: '28px', fontWeight: 900, color: 'var(--info)' }}>1.42<span style={{ fontSize: '14px' }}>kg</span></div>
                </div>
            </div>

            {/* Archive Table */}
            <div className="glass-card" style={{ padding: '0', background: 'var(--bg-surface)' }}>
                <div style={{ padding: '24px', borderBottom: '1px solid var(--border-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>Historical Registry</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>SHOWING LATEST {history.length} ENTRIES</div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.01)' }}>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Workload Timestamp</th>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Model / Config</th>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>HW Node</th>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Avg Power</th>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>CO₂ Emissions</th>
                                <th style={{ padding: '16px 24px', fontSize: '10px', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Sustainability Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                        No telemetry records found. Initiate a workload simulation to populate the archive.
                                    </td>
                                </tr>
                            ) : (
                                history.map((run, i) => (
                                    <tr key={run.run_id || i} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} className="hover-archive-row">
                                        <td className="mono" style={{ padding: '20px 24px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            {new Date(run.timestamp || Date.now()).toLocaleDateString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>{run.model_name || run.model}</div>
                                            <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', fontWeight: 800, textTransform: 'uppercase', marginTop: '4px' }}>{run.task} • {run.precision}</div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{
                                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                                background: 'rgba(255,255,255,0.03)', padding: '4px 8px',
                                                borderRadius: '4px', border: '1px solid var(--border-muted)'
                                            }}>
                                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: run.compute_target === 'npu' ? '#a78bfa' : 'var(--optimal)' }} />
                                                <span className="mono" style={{ fontSize: '10px', fontWeight: 900, color: '#fff', textTransform: 'uppercase' }}>{run.compute_target}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="mono" style={{ fontSize: '16px', fontWeight: 900, color: 'var(--optimal)' }}>
                                                {run.avg_watts?.toFixed(1)}<span style={{ fontSize: '10px', opacity: 0.6 }}>W</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div className="mono" style={{ fontSize: '16px', fontWeight: 900, color: 'var(--info)' }}>
                                                {run.co2_g?.toFixed(3)}<span style={{ fontSize: '10px', opacity: 0.6 }}>g</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '20px 24px' }}>
                                            <div style={{
                                                padding: '6px 14px', borderRadius: '4px', fontSize: '11px', fontWeight: 900,
                                                display: 'inline-block',
                                                background: run.grade === 'A+' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                                                color: run.grade === 'A+' ? 'var(--optimal)' : 'var(--info)',
                                                border: `1px solid ${run.grade === 'A+' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)'}`,
                                                letterSpacing: '0.5px'
                                            }}>
                                                EXTREME EFFICIENCY ({run.grade})
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Insight */}
            <div style={{ marginTop: '32px', padding: '24px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ fontSize: '24px' }}>📑</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    <strong>ESG Metric Tip:</strong> Workloads targetting the <strong>AMD Ryzen™ AI NPU</strong> cluster consistently demonstrate a 4.2x reduction in carbon footprint compared to standard GPU compute paths. Consider migrating mission-critical NLP pipelines to NPU nodes to maximize sustainability ROI.
                </div>
            </div>
        </div>
    )
}
