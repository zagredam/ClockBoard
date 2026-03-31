import { useEffect } from 'react'
import Clock from '../components/Clock'
import TimersSection from '../components/TimersSection'
import GamepadService from '../GamepadService'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'

export default function ClockBoard() {
  const { showSeconds, showMeridum, showDate, toggleAltTheme } = useSettings()
  const {
    showControls,
    timers, stopwatches,
    addStopwatch,
    closeTimer, resetTimer, toggleTimer,
    closeStopwatch, resetStopwatch, toggleStopwatch,
  } = useAppContext()

  useEffect(() => {
    const gamepad = new GamepadService()
    gamepad.enableControlls()

    gamepad.addPressedEvent(0, () => {})
    gamepad.addPressedEvent(1, () => toggleAltTheme())
    gamepad.addPressedEvent(2, () => addStopwatch(''))
    gamepad.addHeldEvent(6, (interval) => {
      if (interval > 1000) resetStopwatch(stopwatches[stopwatches.length - 1]?.id)
    })
    gamepad.addHeldEvent(7, (interval) => {
      if (interval > 1000) closeStopwatch(stopwatches[stopwatches.length - 1]?.id)
    })
    gamepad.addHeldEvent(3, (interval) => {
      if (interval > 1000) window.location.href = 'https://michaelzagreda.com/Apps/Dashboard/index.html'
    })

    return () => gamepad.disengage()
  }, [stopwatches])

  return (
    <div className="container">
      <Clock showSeconds={showSeconds} showMeridum={showMeridum} showDate={showDate} />
      <TimersSection
        timers={timers}
        stopwatches={stopwatches}
        showControls={showControls}
        onCloseTimer={closeTimer}
        onResetTimer={resetTimer}
        onToggleTimer={toggleTimer}
        onCloseStopwatch={closeStopwatch}
        onResetStopwatch={resetStopwatch}
        onToggleStopwatch={toggleStopwatch}
      />
    </div>
  )
}
