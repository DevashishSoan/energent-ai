// Rolling 60-second power data buffer for Chart.js
import { useState, useEffect, useRef } from 'react'

const BUFFER_SIZE = 60

export function usePowerData(lastMessage) {
    const [buffer, setBuffer] = useState([])
    const [latest, setLatest] = useState(null)

    useEffect(() => {
        if (!lastMessage) return
        setLatest(lastMessage)
        setBuffer(prev => {
            const next = [...prev, lastMessage]
            return next.slice(-BUFFER_SIZE)
        })
    }, [lastMessage])

    // Derived chart arrays
    const labels = buffer.map(r => {
        const d = new Date(r.timestamp * 1000)
        return `${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`
    })

    const gpuData = buffer.map(r => r.gpu_watts ?? 0)
    const cpuData = buffer.map(r => r.cpu_watts ?? 0)
    const npuData = buffer.map(r => r.npu_watts ?? null)
    const totalData = buffer.map(r => r.total_watts ?? 0)

    return { buffer, latest, labels, gpuData, cpuData, npuData, totalData }
}
