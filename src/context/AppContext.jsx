import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useServerContext } from './ServerContext'

const AppContext = createContext(null)

function loadStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key)
    return val !== null ? JSON.parse(val) : fallback
  } catch { return fallback }
}

let _idCounter = 0

export function AppProvider({ children }) {
  const { isConnected, serverRequest } = useServerContext()

  const [navOpen, setNavOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const [timers, setTimers] = useState(() => {
    const saved = loadStorage('cb_timers', [])
    if (saved.length) _idCounter = Math.max(_idCounter, Math.max(...saved.map(t => t.id)) + 1)
    return saved
  })

  const [stopwatches, setStopwatches] = useState(() => {
    const saved = loadStorage('cb_stopwatches', [])
    if (saved.length) _idCounter = Math.max(_idCounter, Math.max(...saved.map(sw => sw.id)) + 1)
    return saved
  })

  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  // When server is connected, fetch initial state from server
  useEffect(() => {
    if (!isConnected) return
    Promise.all([
      serverRequest('GET', '/stopwatches'),
      serverRequest('GET', '/timers'),
    ]).then(([swData, tData]) => {
      if (Array.isArray(swData)) {
        setStopwatches(swData)
        if (swData.length) _idCounter = Math.max(_idCounter, Math.max(...swData.map(sw => sw.id)) + 1)
      }
      if (Array.isArray(tData)) {
        setTimers(tData)
        if (tData.length) _idCounter = Math.max(_idCounter, Math.max(...tData.map(t => t.id)) + 1)
      }
    }).catch(err => console.error('Failed to fetch from server:', err))
  }, [isConnected])

  useEffect(() => {
    localStorage.setItem('cb_timers', JSON.stringify(timers))
  }, [timers])

  useEffect(() => {
    localStorage.setItem('cb_stopwatches', JSON.stringify(stopwatches))
  }, [stopwatches])

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  const makeFullscreen = () => {
    const elem = containerRef.current
    if (elem.requestFullscreen) elem.requestFullscreen()
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen()
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen()
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.msExitFullscreen) document.msExitFullscreen()
    setIsFullscreen(false)
  }

  // ── Timer handlers ──────────────────────────────────────────
  const addTimer = useCallback(async (minutes, seconds, label) => {
    if ((minutes === '' && seconds === '') || isNaN(minutes) || isNaN(seconds)) return
    const timerValue = 60000 * (Number(minutes) || 0) + 1000 * (Number(seconds) || 0)
    if (isConnected) {
      const body = { label, timerValue, timeToExp: Date.now() + timerValue, paused: false, timeLeft: null }
      try {
        const result = await serverRequest('POST', '/timers', body)
        const id = result?.id ?? _idCounter++
        setTimers(prev => [...prev, { ...body, id }])
      } catch (err) {
        console.error('Failed to add timer to server:', err)
      }
    } else {
      setTimers(prev => [
        ...prev,
        { id: _idCounter++, label, timerValue, timeToExp: Date.now() + timerValue, paused: false, timeLeft: null },
      ])
    }
  }, [isConnected, serverRequest])

  const closeTimer = useCallback((id) => {
    setTimers(prev => prev.filter(t => t.id !== id))
    if (isConnected) serverRequest('DELETE', `/timers/${id}`).catch(err => console.error('Failed to delete timer:', err))
  }, [isConnected, serverRequest])

  const resetTimer = useCallback((id) => {
    setTimers(prev => prev.map(t =>
      t.id === id ? { ...t, timeToExp: Date.now() + t.timerValue, paused: false, timeLeft: null } : t
    ))
  }, [])

  const toggleTimer = useCallback((id) => {
    setTimers(prev => prev.map(t => {
      if (t.id !== id) return t
      if (!t.paused) {
        if (isConnected) serverRequest('POST', `/timers/pause/${id}`).catch(err => console.error('Failed to pause timer:', err))
        return { ...t, paused: true, timeLeft: (t.timeToExp - Date.now()) / 1000 }
      }
      if (isConnected) serverRequest('POST', `/timers/restart/${id}`).catch(err => console.error('Failed to restart timer:', err))
      return { ...t, paused: false, timeToExp: Date.now() + t.timeLeft * 1000, timeLeft: null }
    }))
  }, [isConnected, serverRequest])

  // ── Stopwatch handlers ──────────────────────────────────────
  const addStopwatch = useCallback(async (label, startTime) => {
    if (isConnected) {
      const body = { label, paused: false, markedTime: startTime ?? Date.now(), pausedDiff: 0 }
      try {
        const result = await serverRequest('POST', '/stopwatches', body)
        const id = result?.id ?? _idCounter++
        setStopwatches(prev => [...prev, { ...body, id }])
      } catch (err) {
        console.error('Failed to add stopwatch to server:', err)
      }
    } else {
      setStopwatches(prev => [
        ...prev,
        { id: _idCounter++, label, paused: false, markedTime: startTime ?? Date.now(), pausedDiff: 0 },
      ])
    }
  }, [isConnected, serverRequest])

  const closeStopwatch = useCallback((id) => {
    setStopwatches(prev => prev.filter(sw => sw.id !== id))
    if (isConnected) serverRequest('DELETE', `/stopwatches/${id}`).catch(err => console.error('Failed to delete stopwatch:', err))
  }, [isConnected, serverRequest])

  const resetStopwatch = useCallback((id) => {
    setStopwatches(prev => prev.map(sw =>
      sw.id === id ? { ...sw, markedTime: Date.now(), pausedDiff: 0 } : sw
    ))
  }, [])

  const toggleStopwatch = useCallback((id) => {
    setStopwatches(prev => prev.map(sw => {
      if (sw.id !== id) return sw
      if (!sw.paused) {
        if (isConnected) serverRequest('POST', `/stopwatches/pause/${id}`).catch(err => console.error('Failed to pause stopwatch:', err))
        return { ...sw, paused: true, pausedDiff: Date.now() - sw.markedTime + sw.pausedDiff }
      }
      if (isConnected) serverRequest('POST', `/stopwatches/restart/${id}`).catch(err => console.error('Failed to restart stopwatch:', err))
      return { ...sw, paused: false, markedTime: Date.now() }
    }))
  }, [isConnected, serverRequest])

  return (
    <AppContext.Provider
      value={{
        navOpen, setNavOpen,
        isFullscreen, makeFullscreen, closeFullscreen,
        showControls,
        containerRef,
        timers, stopwatches,
        addTimer, closeTimer, resetTimer, toggleTimer,
        addStopwatch, closeStopwatch, resetStopwatch, toggleStopwatch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
