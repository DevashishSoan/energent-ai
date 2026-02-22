// Live rolling 60s GPU/CPU/NPU power chart via Chart.js
import { useEffect, useRef } from 'react'
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Filler, Tooltip, Legend)

export default function PowerChart({ labels, gpuData, cpuData, npuData, connected, hardware }) {
    const canvasRef = useRef(null)
    const chartRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        if (chartRef.current) {
            chartRef.current.destroy()
            chartRef.current = null
        }

        const ctx = canvas.getContext('2d')

        // GPU Gradient - subtle emerald
        const gpuGradient = ctx.createLinearGradient(0, 0, 0, 240)
        gpuGradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)')
        gpuGradient.addColorStop(1, 'rgba(16, 185, 129, 0)')

        // CPU Gradient - subtle blue
        const cpuGradient = ctx.createLinearGradient(0, 0, 0, 240)
        cpuGradient.addColorStop(0, 'rgba(59, 130, 246, 0.06)')
        cpuGradient.addColorStop(1, 'rgba(59, 130, 246, 0)')

        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: 'GPU UNIT',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: gpuGradient,
                        borderWidth: 1.5,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'CPU UNIT',
                        data: [],
                        borderColor: '#3b82f6',
                        backgroundColor: cpuGradient,
                        borderWidth: 1.5,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        fill: true,
                        tension: 0.4,
                    },
                    {
                        label: 'RYZEN AI NPU',
                        data: [],
                        borderColor: '#a855f7',
                        backgroundColor: 'transparent',
                        borderWidth: 1.5,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                        fill: false,
                        tension: 0.4,
                        borderDash: [5, 5],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 0 },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: '#d1d1d6', // Explicit hex for canvas resolution
                            font: { family: 'Inter', size: 10, weight: 800 },
                            usePointStyle: true,
                            pointStyle: 'rectRounded',
                            boxWidth: 8,
                            padding: 20,
                        },
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 11, 12, 0.95)',
                        titleColor: '#d1d1d6',
                        bodyColor: '#fff',
                        borderColor: 'rgba(255,255,255,0.08)',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 6,
                        titleFont: { family: 'Inter', size: 10, weight: 800 },
                        bodyFont: { family: 'JetBrains Mono', size: 12 },
                        displayColors: true,
                        callbacks: {
                            label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y?.toFixed(1)} W`,
                        },
                    },
                },
                scales: {
                    x: {
                        ticks: { color: '#a1a1aa', font: { size: 10, family: 'JetBrains Mono', weight: 600 }, maxTicksLimit: 6 },
                        grid: { color: 'rgba(255,255,255,0.02)', drawBorder: false },
                    },
                    y: {
                        ticks: {
                            color: '#a1a1aa',
                            font: { size: 10, family: 'JetBrains Mono', weight: 600 },
                            callback: v => `${v}W`,
                            padding: 10
                        },
                        grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
                        min: 0,
                        suggestedMax: 40,
                    },
                },
            },
        })

        return () => {
            chartRef.current?.destroy()
            chartRef.current = null
        }
    }, [])

    useEffect(() => {
        const chart = chartRef.current
        if (!chart) return
        chart.data.labels = labels
        chart.data.datasets[0].data = gpuData
        chart.data.datasets[1].data = cpuData
        chart.data.datasets[2].data = npuData.map(v => v ?? null)
        chart.update('none')
    }, [labels, gpuData, cpuData, npuData])

    // Format hardware string
    const hardwareLabel = hardware
        ? `${hardware.gpu_model || 'Unknown GPU'} · ${hardware.cpu_model || 'Unknown CPU'}`
        : 'Detecting hardware...';

    return (
        <div className="glass-card" style={{ padding: '20px', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-tertiary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Hardware Telemetry
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff', marginTop: '2px' }}>
                        Live Power Spectrum
                    </div>
                </div>
                {!connected && (
                    <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-tertiary)', background: 'var(--bg-surface-elevated)', padding: '4px 8px', borderRadius: '4px', letterSpacing: '0.5px' }}>
                        CONNECTING...
                    </div>
                )}
            </div>
            <div style={{ height: '240px', position: 'relative' }}>
                <canvas ref={canvasRef} />
                {!connected && labels.length === 0 && (
                    <div className="fade-in" style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-muted)', background: 'rgba(0,0,0,0.2)', backdropFilter: 'blur(2px)'
                    }}>
                        <div style={{ fontSize: '24px', marginBottom: '8px', opacity: 0.5 }}>⚡</div>
                        <div style={{ fontSize: '13px', fontWeight: 500 }}>Waiting for data stream...</div>
                        <div style={{ fontSize: '11px', opacity: 0.7, marginTop: '4px' }}>Press RUN to start workload</div>
                    </div>
                )}
            </div>
        </div>
    )
}
