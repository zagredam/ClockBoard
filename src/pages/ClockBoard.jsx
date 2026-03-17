import { useState, useEffect, useCallback } from 'react'
import Clock from '../components/Clock'
import TimersSection from '../components/TimersSection'
import GamepadService from '../GamepadService'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'

let idCounter = 0

export default function ClockBoard() {
  const { showSeconds, showMeridum, showDate, toggleAltTheme, cycleTheme } = useSettings()
  const { showControls, setAddTimerHandler, setAddStopwatchHandler } = useAppContext()

  const [timers, setTimers] = useState([])
  const [stopwatches, setStopwatches] = useState([])

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

  // Register timer/stopwatch callbacks into Nav (via AppContext)
  useEffect(() => {
    setAddTimerHandler({ fn: handleAddTimer })
    setAddStopwatchHandler({ fn: handleAddStopwatch })
    return () => {
      setAddTimerHandler(null)
      setAddStopwatchHandler(null)
    }
  }, [handleAddTimer, handleAddStopwatch, setAddTimerHandler, setAddStopwatchHandler])

  // Gamepad setup
  useEffect(() => {
    const gamepad = new GamepadService()
    gamepad.enableControlls()

    gamepad.addPressedEvent(0, () => {})
    gamepad.addPressedEvent(1, () => toggleAltTheme())
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
    gamepad.addPressedEvent(4, () => cycleTheme('prev'))
    gamepad.addPressedEvent(5, () => cycleTheme('next'))
    gamepad.addHeldEvent(3, (interval) => {
      if (interval > 1000) window.location.href = 'https://michaelzagreda.com/Apps/Dashboard/index.html'
    })

    return () => gamepad.disengage()
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

  return (
    <div className="container">
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
