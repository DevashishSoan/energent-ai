/**
 * Central API configuration.
 * HTTP API calls use relative paths → Vite proxy forwards to backend.
 * WebSocket connects DIRECTLY to backend (proxy unreliable for WS upgrades).
 */

// In dev, connect WS directly to backend to avoid Vite proxy WS issues
// Use environment variable for production, fallback to current origin
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

// In dev, connect WS directly to backend to avoid Vite proxy WS issues
const isDev = import.meta.env.DEV;
const WS_DIRECT = isDev
    ? `ws://${window.location.hostname}:5001`
    : (API_BASE ? API_BASE.replace('http', 'ws') : (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host);

export const API = {
    models: `${API_BASE}/api/models`,
    hardware: `${API_BASE}/api/hardware`,
    carbon: `${API_BASE}/api/carbon/intensity`,
    predict: `${API_BASE}/api/predict`,
    run: `${API_BASE}/api/run`,
    runById: (id) => `${API_BASE}/api/run/${id}`,
    exportRun: (id, fmt) => `${API_BASE}/api/run/${id}/export?format=${fmt}`,
    optimizeById: (id) => `${API_BASE}/api/run/${id}/optimize`,
    history: `${API_BASE}/api/runs/history`,
    health: `${API_BASE}/api/health`,
    ws: `${WS_DIRECT}/ws/power`,
};

export default API;
