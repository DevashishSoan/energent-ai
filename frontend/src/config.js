/**
 * Central API configuration.
 * HTTP API calls use relative paths → Vite proxy forwards to backend.
 * WebSocket connects DIRECTLY to backend (proxy unreliable for WS upgrades).
 */

// In dev, connect WS directly to backend to avoid Vite proxy WS issues
const isDev = import.meta.env.DEV;
const WS_DIRECT = isDev
    ? `ws://${window.location.hostname}:5001`
    : (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host;

export const API = {
    models: `/api/models`,
    hardware: `/api/hardware`,
    carbon: `/api/carbon/intensity`,
    predict: `/api/predict`,
    run: `/api/run`,
    runById: (id) => `/api/run/${id}`,
    exportRun: (id, fmt) => `/api/run/${id}/export?format=${fmt}`,
    optimizeById: (id) => `/api/run/${id}/optimize`,
    history: `/api/runs/history`,
    health: `/api/health`,
    ws: `${WS_DIRECT}/ws/power`,
};

export default API;
