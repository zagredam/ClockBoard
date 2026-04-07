import { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { useServerContext } from '../context/ServerContext'
import { useSettings } from '../context/SettingsContext'
import '../styles/client.css'

// ── Full-screen Timer ────────────────────────────────────────

function ClientTimer({ item, onClose, onReset, onToggle }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500)
    return () => clearInterval(id)
  }, [])

  const diffInSeconds = item.paused
    ? (item.timeLeft || 0)
    : (item.timeToExp - Date.now()) / 1000

  const expired = diffInSeconds < 0
  const hours   = expired ? 0 : Math.floor(diffInSeconds / 3600)
  const minutes = expired ? 0 : Math.floor((diffInSeconds % 3600) / 60)
  const seconds = expired ? 0 : Math.floor(diffInSeconds % 60)

  const hoursStr   = hours > 0 ? `${hours}:` : ''
  const minutesStr = `${minutes < 10 ? '0' : ''}${minutes}:`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return (
    <div className={`client-fullscreen-item${expired ? ' client-fullscreen-item--expired' : ''}`}>
      <div className="client-item-time">{hoursStr}{minutesStr}{secondsStr}</div>
      {item.label && <div className="client-item-label">{item.label}</div>}
      {item.allowUserControls && (
        <div className="client-item-controls">
          <i className="fas fa-undo-alt client-control-icon" onClick={onReset} />
          <i className={`fas ${item.paused ? 'fa-play' : 'fa-pause'} client-control-icon`} onClick={onToggle} />
          <i className="far fa-window-close client-control-icon" onClick={onClose} />
        </div>
      )}
    </div>
  )
}

// ── Full-screen Stopwatch ────────────────────────────────────

function ClientStopwatch({ item, onClose, onReset, onToggle }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 500)
    return () => clearInterval(id)
  }, [])

  const diffInSeconds = item.paused
    ? item.pausedDiff / 1000
    : (Date.now() - item.markedTime + item.pausedDiff) / 1000

  const hours   = Math.floor(diffInSeconds / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = Math.floor(diffInSeconds % 60)

  const hoursStr   = hours > 0 ? `${hours}:` : ''
  const minutesStr = `${minutes < 10 ? '0' : ''}${minutes}:`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return (
    <div className="client-fullscreen-item">
      <div className="client-item-time">{hoursStr}{minutesStr}{secondsStr}</div>
      {item.label && <div className="client-item-label">{item.label}</div>}
      {item.allowUserControls && (
        <div className="client-item-controls">
          <i className="fas fa-undo-alt client-control-icon" onClick={onReset} />
          <i className={`fas ${item.paused ? 'fa-play' : 'fa-pause'} client-control-icon`} onClick={onToggle} />
          <i className="far fa-window-close client-control-icon" onClick={onClose} />
        </div>
      )}
    </div>
  )
}

// ── Client Page ──────────────────────────────────────────────

export default function Client() {
  const { serverUrl, isConnected } = useServerContext()
  const { theme, setTheme, themeOptions } = useSettings()
  const location = useLocation()

  const [time, setTime]         = useState(new Date())
  const [clientId, setClientId] = useState(null)
  const [wsStatus, setWsStatus] = useState('connecting') // 'connecting' | 'connected' | 'error' | 'closed'
  const [activeItem, setActiveItem] = useState(null)

  const wsRef = useRef(null)

  // Clock tick
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Force theme to None when server locks styling
  useEffect(() => {
    if (activeItem && !activeItem.allowUserStyling) {
      const prev = document.body.className
      document.body.className = ''
      return () => { document.body.className = prev }
    }
  }, [activeItem?.allowUserStyling, !!activeItem])

  // WebSocket connection — only when explicitly on /client
  useEffect(() => {
    if (location.pathname !== '/client' || !isConnected || !serverUrl) {
      setWsStatus('closed')
      return
    }

    const wsUrl = serverUrl
      .replace(/^https/, 'wss')
      .replace(/^http/, 'ws')
      .replace(/\/$/, '') + '/ws/client'

    let ws
    try {
      ws = new WebSocket(wsUrl)
    } catch {
      setWsStatus('error')
      return
    }
    wsRef.current = ws

    ws.onopen  = () => setWsStatus('connected')
    ws.onerror = () => setWsStatus('error')
    ws.onclose = () => setWsStatus('closed')

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        switch (msg.type) {
          case 'clientId':
            setClientId(msg.id)
            break
          case 'Timer':
            setActiveItem({ ...msg })
            break
          case 'Stopwatch':
            setActiveItem({ ...msg })
            break
          case 'clear':
            setActiveItem(null)
            break
          default:
            break
        }
      } catch { /* malformed message */ }
    }

    return () => ws.close()
  }, [location.pathname, isConnected, serverUrl])

  const send = useCallback((payload) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    }
  }, [])

  const handleClose = useCallback(() => {
    setActiveItem(null)
    send({ type: 'close' })
  }, [send])

  const handleReset = useCallback(() => {
    setActiveItem(prev => {
      if (!prev) return prev
      if (prev.type === 'Timer') {
        return { ...prev, timeToExp: Date.now() + prev.timerValue, paused: false, timeLeft: null }
      }
      return { ...prev, markedTime: Date.now(), pausedDiff: 0 }
    })
    send({ type: 'reset' })
  }, [send])

  const handleToggle = useCallback(() => {
    setActiveItem(prev => {
      if (!prev) return prev
      if (prev.type === 'Timer') {
        if (!prev.paused) {
          return { ...prev, paused: true, timeLeft: (prev.timeToExp - Date.now()) / 1000 }
        }
        return { ...prev, paused: false, timeToExp: Date.now() + prev.timeLeft * 1000, timeLeft: null }
      }
      // Stopwatch
      if (!prev.paused) {
        return { ...prev, paused: true, pausedDiff: Date.now() - prev.markedTime + prev.pausedDiff }
      }
      return { ...prev, paused: false, markedTime: Date.now() }
    })
    send({ type: 'toggle' })
  }, [send])

  const h = time.getHours() % 12 || 12
  const m = time.getMinutes()
  const timeStr = `${h}:${m < 10 ? '0' : ''}${m}`

  const allowStyling = !activeItem || activeItem.allowUserStyling

  return (
    <div className="client-page">
      {activeItem ? (
        activeItem.type === 'Timer'
          ? <ClientTimer  item={activeItem} onClose={handleClose} onReset={handleReset} onToggle={handleToggle} />
          : <ClientStopwatch item={activeItem} onClose={handleClose} onReset={handleReset} onToggle={handleToggle} />
      ) : (
        <div className="client-clock">
          <div className="client-clock-time">{timeStr}</div>
          {clientId && (
            <div className="client-id-badge">ID: {clientId}</div>
          )}
          {wsStatus === 'connecting' && (
            <div className="client-ws-status">Connecting…</div>
          )}
          {wsStatus === 'error' && (
            <div className="client-ws-status client-ws-status--error">Connection error</div>
          )}
          {wsStatus === 'closed' && !isConnected && (
            <div className="client-ws-status client-ws-status--error">No server configured</div>
          )}
        </div>
      )}

      {isConnected && wsStatus !== 'connected' && wsStatus !== 'connecting' && (
        <div className="client-disconnected-badge">
          <i className="fas fa-wifi" />
          <i className="fas fa-slash client-disconnected-slash" />
          <span>Disconnected</span>
        </div>
      )}

      {allowStyling && (
        <div className="client-theme-picker">
          <select
            className="client-theme-select"
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            {themeOptions.map(t => (
              <option key={t.id} value={t.id}>{t.label || t.id}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
