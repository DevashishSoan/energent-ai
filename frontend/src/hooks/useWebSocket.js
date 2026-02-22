// WebSocket connection to /ws/power with auto-reconnect every 2s
// Handles React StrictMode double-mount cleanly with a mounted flag
import { useState, useEffect, useRef, useCallback } from 'react'

// Direct IPv4 connection to avoid localhost→IPv6 resolution issues on Windows
import API from '../config.js';
const WS_URL = API.ws;
const RECONNECT_DELAY = 2000

export function useWebSocket() {
    const [connected, setConnected] = useState(false)
    const [lastMessage, setLastMessage] = useState(null)
    const wsRef = useRef(null)
    const reconnectTimer = useRef(null)
    const mountedRef = useRef(true)  // prevents reconnect after unmount

    const connect = useCallback(() => {
        if (!mountedRef.current) return
        // Don't open a new socket if one is already open or connecting
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) return

        try {
            const ws = new WebSocket(WS_URL)
            wsRef.current = ws

            ws.onopen = () => {
                if (!mountedRef.current) { ws.close(); return }
                setConnected(true)
                if (reconnectTimer.current) {
                    clearTimeout(reconnectTimer.current)
                    reconnectTimer.current = null
                }
            }

            ws.onmessage = (e) => {
                if (!mountedRef.current) return
                try {
                    setLastMessage(JSON.parse(e.data))
                } catch { }
            }

            ws.onclose = () => {
                if (!mountedRef.current) return
                setConnected(false)
                wsRef.current = null
                reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY)
            }

            ws.onerror = () => {
                ws.close()
            }
        } catch {
            if (mountedRef.current) {
                reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY)
            }
        }
    }, [])

    useEffect(() => {
        mountedRef.current = true
        // Debounce connection to avoid React StrictMode double-mount "closed before established" warning
        const timer = setTimeout(() => {
            connect()
        }, 100)

        return () => {
            mountedRef.current = false
            clearTimeout(timer)
            if (reconnectTimer.current) {
                clearTimeout(reconnectTimer.current)
                reconnectTimer.current = null
            }
            if (wsRef.current) {
                // Prevent creating a new connection if we're unmounting
                wsRef.current.onclose = null
                wsRef.current.close()
                wsRef.current = null
            }
        }
    }, [connect])

    return { connected, lastMessage }
}
