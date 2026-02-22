import { useState, useEffect, useCallback } from 'react'
import '../index.css'
import API from '../config.js'

import { useWebSocket } from '../hooks/useWebSocket'
import { usePowerData } from '../hooks/usePowerData'
import { usePredict } from '../hooks/usePredict'

import PowerChart from '../components/PowerChart'
import EfficiencyGrade from '../components/EfficiencyGrade'
import TopologyFlow from '../components/TopologyFlow'
import OptimizationTable from '../components/OptimizationTable'
import CarbonContext from '../components/CarbonContext'
import BeforeAfter from '../components/BeforeAfter'
import PredictionPanel from '../components/PredictionPanel'
import ValidationTable from '../components/ValidationTable'
import NPUStory from '../components/NPUStory'
import FallbackStory from '../components/FallbackStory'
import AIRecommendation from '../components/AIRecommendation'

// App states: IDLE → RUNNING → ANALYZING → OPTIMIZED → COMPLETE
const STATES = { IDLE: 'IDLE', RUNNING: 'RUNNING', ANALYZING: 'ANALYZING', OPTIMIZED: 'OPTIMIZED', COMPLETE: 'COMPLETE' }

const TASK_OPTIONS = ['NLP', 'Vision', 'LLM']
const COMPUTE_OPTIONS = ['gpu', 'cpu', 'npu']
const PRECISION_OPTIONS = ['FP32', 'FP16', 'INT8']

export default function Dashboard() {
    // ── State ──────────────────────────────────────────────────────────────────
    const [appState, setAppState] = useState(STATES.IDLE)
    const [models, setModels] = useState([])
    const [loadingModels, setLoadingModels] = useState(true)
    const [modelError, setModelError] = useState(null)
    const [hardware, setHardware] = useState(null)
    const [carbon, setCarbon] = useState(null)

    // Config selectors
    const [selectedTask, setSelectedTask] = useState('NLP')
    const [selectedModel, setSelectedModel] = useState('')
    const [computeTarget, setComputeTarget] = useState('gpu')
    const [precision, setPrecision] = useState('FP32')

    // Run data
    const [currentRunId, setCurrentRunId] = useState(null)
    const [currentRun, setCurrentRun] = useState(null)
    const [baselineRun, setBaselineRun] = useState(null)
    const [suggestions, setSuggestions] = useState([])

    // ── WebSocket & power data ─────────────────────────────────────────────────
    const { connected, lastMessage } = useWebSocket()
    const { latest, labels, gpuData, cpuData, npuData } = usePowerData(lastMessage)

    // ── PreOpt prediction ──────────────────────────────────────────────────────
    const { prediction, loading: predLoading } = usePredict(selectedModel, computeTarget, precision)

    // ── Load models & hardware on mount ───────────────────────────────────────
    useEffect(() => {
        setLoadingModels(true);

        fetch(API.models)
            .then(r => {
                if (!r.ok) throw new Error(`Server HTTP ${r.status}`);
                return r.json();
            })
            .then(data => {
                setModels(data);
                setModelError(null);
            })
            .catch(e => {
                console.error('Models fetch failed:', e);
                setModelError(e.message || 'Failed to connect to backend');
            })
            .finally(() => setLoadingModels(false));

        fetch(API.hardware).then(r => r.json()).then(setHardware).catch(() => { })
        fetch(API.carbon).then(r => r.json()).then(setCarbon).catch(() => { })
    }, [])

    // Auto-select first model when task changes
    useEffect(() => {
        const filtered = models.filter(m => m.task === selectedTask)
        if (filtered.length) setSelectedModel(filtered[0].model_id)
    }, [selectedTask, models])

    // ── Poll run status while running ──────────────────────────────────────────
    useEffect(() => {
        if (!currentRunId || appState !== STATES.RUNNING) return
        const interval = setInterval(async () => {
            try {
                const run = await fetch(API.runById(currentRunId)).then(r => r.json())
                setCurrentRun(run)
                if (run.status === 'complete') {
                    clearInterval(interval)
                    setAppState(STATES.ANALYZING)
                    const sugs = await fetch(API.optimizeById(currentRunId)).then(r => r.json())
                    setSuggestions(sugs)
                    setAppState(STATES.COMPLETE)
                } else if (run.status === 'failed') {
                    clearInterval(interval)
                    setAppState(STATES.IDLE)
                }
            } catch { }
        }, 1000)
        return () => clearInterval(interval)
    }, [currentRunId, appState])

    // ── Actions ────────────────────────────────────────────────────────────────
    const handleRun = useCallback(async () => {
        if (!selectedModel) return
        setAppState(STATES.RUNNING)
        setSuggestions([])
        setCurrentRun(null)
        if (!baselineRun) setBaselineRun(null)

        try {
            const resp = await fetch(API.run, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: selectedModel,
                    task: selectedTask,
                    precision,
                    compute_target: computeTarget,
                    batch_size: 1,
                    num_samples: 10,
                }),
            })
            const { run_id } = await resp.json()
            setCurrentRunId(run_id)
        } catch {
            setAppState(STATES.IDLE)
        }
    }, [selectedModel, selectedTask, precision, computeTarget, baselineRun])

    const handleApplyBestAlternative = useCallback((alt) => {
        setSelectedModel(alt.model_id)
        setComputeTarget(alt.compute_target)
        setPrecision(alt.precision)
    }, [])

    const handleApplyAll = useCallback(async () => {
        if (!currentRun) return
        // Save baseline, then run optimized
        setBaselineRun(currentRun)
        if (suggestions.length) {
            const best = suggestions[0]
            // Extract model from suggestion text (best effort)
            const newPrecision = best.type === 'precision' ? best.suggested_config.split(' ')[0] : precision
            const newCompute = best.type === 'compute_route' ? 'npu' : computeTarget
            setPrecision(newPrecision)
            setComputeTarget(newCompute)
        }
        setAppState(STATES.OPTIMIZED)
        await handleRun()
    }, [currentRun, suggestions, precision, computeTarget, handleRun])

    const handleReset = useCallback(() => {
        setAppState(STATES.IDLE)
        setCurrentRunId(null)
        setCurrentRun(null)
        setBaselineRun(null)
        setSuggestions([])
    }, [])


    // ── Filtered models for dropdown ───────────────────────────────────────────
    const filteredModels = models.filter(m => m.task === selectedTask)

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>

            {/* ── System Header ── */}
            <header className="header-glass glass-premium" style={{ borderBottom: '1px solid var(--border-muted)', borderRadius: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="logo-text" style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.7px' }}>
                            ENER<span style={{ color: 'var(--optimal)' }}>GENT</span> AI
                        </span>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', fontWeight: 900, letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                            SUSTAINABILITY ANALYTICS
                        </span>
                    </div>
                    <div style={{ width: '1px', height: '28px', background: 'var(--border-muted)' }} />
                    <nav style={{ display: 'flex', gap: '24px', fontSize: '12px' }}>
                        <span className="tab-active">Dashboard</span>
                        <div style={{ width: '1px', height: '12px', background: 'var(--border-subtle)', alignSelf: 'center' }} />
                        <span className="tab-inactive" style={{ opacity: 0.8 }}>Workloads</span>
                        <span className="tab-inactive" style={{ opacity: 0.8 }}>Optimization</span>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    {carbon && (
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🌍 <span className="mono" style={{ color: carbon.source === 'live' ? 'var(--optimal)' : 'var(--warning)', fontWeight: 800 }}>
                                {carbon.intensity_g_kwh?.toFixed(0)} <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>G/KWH</span>
                            </span>
                        </div>
                    )}
                    <div style={{ height: '20px', width: '1px', background: 'var(--border-muted)' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '10px', fontWeight: 800 }}>
                        <div className="live-dot" />
                        <span style={{ color: 'var(--optimal)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>CORE ENGINE LIVE</span>
                    </div>
                    <a
                        href="/Energent_AI_User_Manual.docx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                        style={{ padding: '8px 16px', fontSize: '10px', fontWeight: 900, textDecoration: 'none', letterSpacing: '0.5px' }}
                    >
                        DOCS
                    </a>
                </div>
            </header>


            {/* ── Main layout ── */}
            <main className="main-layout">

                {/* ── Left panel: controls ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* AI Recommendation Engine — New Hero Insight */}
                    <AIRecommendation prediction={prediction} suggestions={suggestions} />

                    {/* Engine Configuration — Advanced Control Center */}
                    <div className="glass-card" style={{ padding: '24px', background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, var(--bg-surface) 100%)' }}>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '24px' }}>
                            Core Control Center
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {/* Task Type Selector */}
                            <div>
                                <label style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 900, display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>AI CLUSTER</label>
                                <select className="control-glass" value={selectedTask} onChange={e => setSelectedTask(e.target.value)} style={{ width: '100%' }}>
                                    {TASK_OPTIONS.map(t => <option key={t} value={t}>{t} Operations</option>)}
                                </select>
                            </div>

                            {/* Model Selector */}
                            <div>
                                <label style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 900, display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>MODEL ENGINE</label>
                                {loadingModels ? (
                                    <div style={{ color: 'var(--text-muted)', fontSize: '12px', padding: '10px', background: 'var(--bg-base)', border: '1px dashed var(--border-muted)', borderRadius: '6px' }}>
                                        Intergrating engine list...
                                    </div>
                                ) : modelError ? (
                                    <div style={{ color: 'var(--alert)', fontSize: '12px', padding: '10px', border: '1px solid var(--alert)', borderRadius: '6px' }}>
                                        Link Error
                                    </div>
                                ) : (
                                    <select className="control-glass" value={selectedModel} onChange={e => setSelectedModel(e.target.value)} style={{ width: '100%' }}>
                                        {filteredModels.map(m => (
                                            <option key={m.model_id} value={m.model_id}>{m.display_name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* HW & Precision Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 900, display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>HARDWARE</label>
                                    <select className="control-glass" value={computeTarget} onChange={e => setComputeTarget(e.target.value)} style={{ width: '100%' }}>
                                        {COMPUTE_OPTIONS.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ fontSize: '9px', color: 'var(--text-tertiary)', fontWeight: 900, display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>PRECISION</label>
                                    <select className="control-glass" value={precision} onChange={e => setPrecision(e.target.value)} style={{ width: '100%' }}>
                                        {PRECISION_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="divider" style={{ margin: '32px 0', opacity: 0.5 }} />

                        {/* Execute Action */}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                className="btn-primary"
                                style={{
                                    flex: 1, height: '48px', fontSize: '11px', fontWeight: 900,
                                    letterSpacing: '1.5px', textTransform: 'uppercase',
                                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)'
                                }}
                                onClick={handleRun}
                                disabled={!selectedModel || appState === STATES.RUNNING || appState === STATES.ANALYZING}
                            >
                                {appState === STATES.RUNNING ? 'ENGINE ACTIVE' :
                                    appState === STATES.ANALYZING ? 'STABILIZING...' : 'INITIALIZE ENGINE'}
                            </button>
                            {(appState === STATES.COMPLETE || appState === STATES.OPTIMIZED) && (
                                <button
                                    className="btn-secondary"
                                    style={{ height: '48px', padding: '0 20px', fontWeight: 800 }}
                                    onClick={handleReset}
                                >
                                    RESET
                                </button>
                            )}
                        </div>
                    </div>

                    {/* PreOpt Prediction Panel */}
                    <PredictionPanel
                        prediction={prediction}
                        loading={predLoading}
                        onApply={handleApplyBestAlternative}
                    />

                    {/* Fallback story — answers "What if no AMD hardware?" */}
                    <FallbackStory hardware={hardware} />
                </div>

                {/* ── Right panel: charts + results ── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Hero Visuals Section */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 420px)', gap: '16px' }}>
                        <TopologyFlow latest={latest} connected={connected} />
                        <NPUStory />
                    </div>


                    {/* Power chart + grade row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px', gap: '16px', alignItems: 'start' }}>
                        <PowerChart
                            labels={labels}
                            gpuData={gpuData}
                            cpuData={cpuData}
                            npuData={npuData}
                            connected={connected}
                            hardware={hardware}
                        />
                        <EfficiencyGrade
                            grade={currentRun?.grade || prediction?.predicted_grade}
                            avgWatts={currentRun?.avg_watts || prediction?.predicted_watts}
                            co2PerRun={currentRun?.co2_g}
                            isPredicted={!currentRun?.grade && !!prediction?.predicted_grade}
                            branding="Energent AI"
                        />
                    </div>

                    {/* Live stats bar — Wrapped in Glass Premium */}
                    {latest && (
                        <div className="glass-premium fade-in" style={{ padding: '24px 32px' }}>
                            <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                                {[
                                    { label: 'GPU CLUSTER', value: `${latest.gpu_watts?.toFixed(1)}W`, color: 'var(--optimal)', size: '26px' },
                                    { label: 'CPU NODE', value: `${latest.cpu_watts?.toFixed(1)}W`, color: 'var(--info)', size: '26px' },
                                    latest.npu_watts != null && { label: 'AMD NPU', value: `${latest.npu_watts?.toFixed(1)}W`, color: '#a78bfa', size: '26px' },
                                    { label: 'TOTAL CONSUMPTION', value: `${latest.total_watts?.toFixed(1)}W`, color: '#fff', size: '36px' },
                                    { label: 'CUMULATIVE CO₂', value: `${latest.co2_g_cumulative?.toFixed(3)}g`, color: 'var(--text-tertiary)', size: '26px' },
                                ].filter(Boolean).map(item => (
                                    <div key={item.label} style={{ textAlign: 'center' }}>
                                        <div style={{ fontSize: '9px', color: 'var(--text-tertiary)', marginBottom: '6px', fontWeight: 900, letterSpacing: '1px', textTransform: 'uppercase' }}>{item.label}</div>
                                        <div className="mono" style={{ fontSize: item.size, fontWeight: 900, color: item.color, lineHeight: 1 }}>{item.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Before/After */}
                    {baselineRun && currentRun?.status === 'complete' && (
                        <BeforeAfter baseline={baselineRun} optimized={currentRun} />
                    )}

                    {/* Optimization suggestions */}
                    {suggestions.length > 0 && (
                        <OptimizationTable
                            suggestions={suggestions}
                            runId={currentRunId}
                            onApplyAll={appState === STATES.COMPLETE ? handleApplyAll : null}
                        />
                    )}

                    {/* Carbon context */}
                    {(currentRun?.co2_g || prediction?.carbon_context) && (
                        <CarbonContext
                            co2Grams={currentRun?.co2_g}
                            context={currentRun ? null : prediction?.carbon_context}
                            gridIntensity={carbon?.intensity_g_kwh}
                            gridSource={carbon?.source}
                        />
                    )}

                    {/* Validation table */}
                    <ValidationTable />

                    {/* NEW: Projected Annual Impact (Fills dead space) */}
                    <div className="glass-premium fade-in" style={{ padding: '28px', borderLeft: '3px solid var(--optimal)', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: 900, color: 'var(--optimal)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Impact Projection
                                </div>
                                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', marginTop: '6px', letterSpacing: '-0.5px' }}>
                                    Annual Sustainability ROI
                                </div>
                            </div>
                            <div style={{ fontSize: '24px' }}>🌲</div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Est. Annual Savings</div>
                                <div className="mono" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--optimal)', lineHeight: 1 }}>
                                    $142.60
                                </div>
                                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 800 }}>OPERATIONAL REDUCTION</div>
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontSize: '9px', fontWeight: 900, color: 'var(--text-tertiary)', marginBottom: '10px', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Carbon Offset</div>
                                <div className="mono" style={{ fontSize: '24px', fontWeight: 900, color: 'var(--info)', lineHeight: 1 }}>
                                    14.8 <span style={{ fontSize: '12px' }}>KG</span>
                                </div>
                                <div style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '8px', fontWeight: 800 }}>24.2 TREES EQUIVALENT</div>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.2)',
                            borderRadius: '8px', fontSize: '10px', color: 'var(--text-secondary)',
                            lineHeight: 1.6, border: '1px dashed var(--border-muted)'
                        }}>
                            "Optimizing this engine today prevents <strong>14.8kg</strong> of CO2 emissions annually. That's equivalent to driving an average passenger vehicle for 36 miles."
                        </div>
                    </div>

                    {/* State indicator */}
                    {appState !== STATES.IDLE && (
                        <div style={{
                            textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)',
                            padding: '8px', letterSpacing: '1px',
                        }}>
                            STATE: <span className="mono" style={{ color: 'var(--green)' }}>{appState}</span>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}
