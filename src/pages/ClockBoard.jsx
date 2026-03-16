import { useState, useEffect, useRef, useCallback } from 'react'
import Nav from '../components/Nav'
import Clock from '../components/Clock'
import TimersSection from '../components/TimersSection'
import GamepadService from '../GamepadService'

const NFL_TEAMS = [
  'None', 'MZ', 'ARZ', 'ATL', 'BLT', 'BUF', 'CAR', 'CHI', 'CIN', 'CLV',
  'DAL', 'DEN', 'DET', 'GB', 'HST', 'IND', 'JAX', 'KC', 'LAC', 'LA',
  'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'LV', 'PHI', 'PIT', 'SF',
  'SEA', 'TB', 'TEN', 'WAS',
]

let idCounter = 0

export default function ClockBoard() {
  const [theme, setTheme] = useState('None')
  const [altTheme, setAltTheme] = useState(false)
  const [showSeconds, setShowSeconds] = useState(true)
  const [showMeridum, setShowMeridum] = useState(true)
  const [showDate, setShowDate] = useState(true)
  const [navOpen, setNavOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [timers, setTimers] = useState([])
  const [stopwatches, setStopwatches] = useState([])

  const appRef = useRef(null)
  const hideNavTimeoutRef = useRef(null)

  // Apply theme classes to body
  useEffect(() => {
    const classes = [theme !== 'None' ? theme : '', altTheme ? 'alt' : ''].filter(Boolean)
    document.body.className = classes.join(' ')
  }, [theme, altTheme])

  // Auto-hide controls on mouse idle
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideNavTimeoutRef.current) clearTimeout(hideNavTimeoutRef.current)
      hideNavTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (hideNavTimeoutRef.current) clearTimeout(hideNavTimeoutRef.current)
    }
  }, [])

  // Gamepad setup
  useEffect(() => {
    const gamepad = new GamepadService()
    gamepad.enableControlls()

    gamepad.addPressedEvent(0, () => {})
    gamepad.addPressedEvent(1, () => setAltTheme((v) => !v))
    gamepad.addPressedEvent(2, () => {
      setStopwatches((prev) => [
        ...prev,
        { id: idCounter++, label: '', paused: false, markedTime: Date.now(), pausedDiff: 0 },
      ])
    })
    gamepad.addHeldEvent(6, (interval) => {
      if (interval > 1000) {
        setStopwatches((prev) => {
          if (prev.length === 0) return prev
          return prev.map((sw, i) =>
            i === prev.length - 1 ? { ...sw, markedTime: Date.now(), pausedDiff: 0 } : sw,
          )
        })
      }
    })
    gamepad.addHeldEvent(7, (interval) => {
      if (interval > 1000) {
        setStopwatches((prev) => prev.slice(0, -1))
      }
    })
    gamepad.addPressedEvent(4, () => {
      setTheme((current) => {
        const idx = NFL_TEAMS.indexOf(current)
        return NFL_TEAMS[idx <= 0 ? NFL_TEAMS.length - 1 : idx - 1]
      })
    })
    gamepad.addPressedEvent(5, () => {
      setTheme((current) => {
        const idx = NFL_TEAMS.indexOf(current)
        return NFL_TEAMS[idx >= NFL_TEAMS.length - 1 ? 0 : idx + 1]
      })
    })
    gamepad.addHeldEvent(3, (interval) => {
      if (interval > 1000) window.location.href = 'https://michaelzagreda.com/Apps/Dashboard/index.html'
    })

    return () => gamepad.disengage()
  }, [])

  const handleAddTimer = useCallback((minutes, seconds, label) => {
    if ((minutes === '' && seconds === '') || isNaN(minutes) || isNaN(seconds)) return
    const timerValue = 60 * 1000 * (Number(minutes) || 0) + 1000 * (Number(seconds) || 0)
    setTimers((prev) => [
      ...prev,
      { id: idCounter++, label, timerValue, timeToExp: Date.now() + timerValue, paused: false, timeLeft: null },
    ])
  }, [])

  const handleAddStopwatch = useCallback((label) => {
    setStopwatches((prev) => [
      ...prev,
      { id: idCounter++, label, paused: false, markedTime: Date.now(), pausedDiff: 0 },
    ])
  }, [])

  const handleCloseTimer = useCallback((id) => {
    setTimers((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const handleResetTimer = useCallback((id) => {
    setTimers((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, timeToExp: Date.now() + t.timerValue, paused: false, timeLeft: null }
          : t,
      ),
    )
  }, [])

  const handleToggleTimer = useCallback((id) => {
    setTimers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        if (!t.paused) {
          return { ...t, paused: true, timeLeft: (t.timeToExp - Date.now()) / 1000 }
        }
        return { ...t, paused: false, timeToExp: Date.now() + (t.timeLeft * 1000), timeLeft: null }
      }),
    )
  }, [])

  const handleCloseStopwatch = useCallback((id) => {
    setStopwatches((prev) => prev.filter((sw) => sw.id !== id))
  }, [])

  const handleResetStopwatch = useCallback((id) => {
    setStopwatches((prev) =>
      prev.map((sw) => (sw.id === id ? { ...sw, markedTime: Date.now(), pausedDiff: 0 } : sw)),
    )
  }, [])

  const handleToggleStopwatch = useCallback((id) => {
    setStopwatches((prev) =>
      prev.map((sw) => {
        if (sw.id !== id) return sw
        if (!sw.paused) {
          return { ...sw, paused: true, pausedDiff: Date.now() - sw.markedTime + sw.pausedDiff }
        }
        return { ...sw, paused: false, markedTime: Date.now() }
      }),
    )
  }, [])

  const makeFullscreen = () => {
    const elem = appRef.current
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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setAltTheme(false)
  }

  return (
    <div id="app" ref={appRef} className="container">
      <div>
        <div
          id="mainNavIcon"
          className={`actionIcon${showControls ? ' show' : ''}`}
          style={{ position: 'absolute', top: '5%', left: '3%' }}
          onClick={() => setNavOpen(true)}
        >
          &#9776;
        </div>
      </div>

      <Nav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        theme={theme}
        onThemeChange={handleThemeChange}
        altTheme={altTheme}
        onAltThemeToggle={() => setAltTheme((v) => !v)}
        showDate={showDate}
        onDateToggle={() => setShowDate((v) => !v)}
        showSeconds={showSeconds}
        onSecondsToggle={() => setShowSeconds((v) => !v)}
        showMeridum={showMeridum}
        onMeridumToggle={() => setShowMeridum((v) => !v)}
        onAddTimer={handleAddTimer}
        onAddStopwatch={handleAddStopwatch}
      />

      <div
        id="fullscreenButton"
        className={`fullscreen${showControls ? ' show' : ''}`}
        style={{ textAlign: 'right', width: '45%', display: 'inline-block' }}
      >
        {!isFullscreen && (
          <i id="fullscreen-open" onClick={makeFullscreen} className="fas fa-expand actionIcon"></i>
        )}
        {isFullscreen && (
          <i id="fullscreen-close" onClick={closeFullscreen} className="fas fa-compress actionIcon"></i>
        )}
      </div>

      <Clock showSeconds={showSeconds} showMeridum={showMeridum} showDate={showDate} />

      <TimersSection
        timers={timers}
        stopwatches={stopwatches}
        showControls={showControls}
        onCloseTimer={handleCloseTimer}
        onResetTimer={handleResetTimer}
        onToggleTimer={handleToggleTimer}
        onCloseStopwatch={handleCloseStopwatch}
        onResetStopwatch={handleResetStopwatch}
        onToggleStopwatch={handleToggleStopwatch}
      />
    </div>
  )
}
