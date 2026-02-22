// Fires GET /api/predict on every model/compute/precision change
import { useState, useEffect } from 'react'
import API from '../config.js'

export function usePredict(modelId, computeTarget, precision) {
    const [prediction, setPrediction] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!modelId) {
            setPrediction(null)
            return
        }

        setLoading(true)
        setError(null)

        const params = new URLSearchParams({
            model_id: modelId,
            compute_target: computeTarget || 'gpu',
            precision: precision || 'FP32',
        })

        const controller = new AbortController()

        fetch(`${API.predict}?${params}`, { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}`)
                return r.json()
            })
            .then(data => {
                setPrediction(data)
                setLoading(false)
            })
            .catch(err => {
                if (err.name !== 'AbortError') {
                    setError(err.message)
                    setLoading(false)
                }
            })

        return () => controller.abort()
    }, [modelId, computeTarget, precision])

    return { prediction, loading, error }
}
