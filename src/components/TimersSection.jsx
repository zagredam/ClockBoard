import { useState, useEffect } from 'react'
import Timer from './Timer'
import Stopwatch from './Stopwatch'

export default function TimersSection({
  timers,
  stopwatches,
  showControls,
  onCloseTimer,
  onResetTimer,
  onToggleTimer,
  onCloseStopwatch,
  onResetStopwatch,
  onToggleStopwatch,
}) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div id="presentationTimers">
      <div id="timersSection">
        {timers.map((timer) => (
          <Timer
            key={timer.id}
            timer={timer}
            tick={tick}
            showControls={showControls}
            onClose={() => onCloseTimer(timer.id)}
            onReset={() => onResetTimer(timer.id)}
            onToggle={() => onToggleTimer(timer.id)}
          />
        ))}
        {stopwatches.map((sw) => (
          <Stopwatch
            key={sw.id}
            stopwatch={sw}
            tick={tick}
            showControls={showControls}
            onClose={() => onCloseStopwatch(sw.id)}
            onReset={() => onResetStopwatch(sw.id)}
            onToggle={() => onToggleStopwatch(sw.id)}
          />
        ))}
      </div>
    </div>
  )
}
