import { useState, useEffect, useRef } from 'react'
import DigitalDigit from '../components/DigitalDigit'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'
import "../styles/digital.css"

const WEEKDAYS_SHORT = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const WEEKDAYS_FULL  = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const MONTHS_SHORT   = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC']
const MONTHS_FULL    = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

function buildFullDateChars(date) {
  const day   = WEEKDAYS_FULL[date.getDay()].split('')
  const month = MONTHS_FULL[date.getMonth()].split('')
  const d1    = String(Math.floor(date.getDate() / 10))
  const d2    = String(date.getDate() % 10)
  const y     = String(date.getFullYear()).split('')
  return [...day, ' ', ...month, ' ', d1, d2, ',', ' ', ...y]
}

// ── Digital timer/stopwatch items ────────────────────────────

function DigitalTimerItem({ timer, showControls, onClose, onReset, onToggle }) {
  const diffInSeconds = timer.paused
    ? (timer.timeLeft || 0)
    : (timer.timeToExp - Date.now()) / 1000

  const expired = diffInSeconds < 0
  const hours   = expired ? 0 : Math.floor(diffInSeconds / 3600)
  const minutes = expired ? 0 : Math.floor((diffInSeconds % 3600) / 60)
  const seconds = expired ? 0 : Math.floor(diffInSeconds % 60)

  return (
    <div className={`digital-item${expired ? ' digital-item--expired' : ''}`}>
      <div className="digital-digit-group digital-digit-group--item">
        {hours > 0 && <>
          <DigitalDigit digit={String(Math.floor(hours / 10))} />
          <DigitalDigit digit={String(hours % 10)} />
          <span className="digit-sep"> </span>
        </>}
        <DigitalDigit digit={String(Math.floor(minutes / 10))} />
        <DigitalDigit digit={String(minutes % 10)} />
        <span className="digit-sep"> </span>
        <DigitalDigit digit={String(Math.floor(seconds / 10))} />
        <DigitalDigit digit={String(seconds % 10)} />
      </div>
      {timer.label && <div className="digital-item-label">{timer.label}</div>}
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset} />
        <i className="far fa-window-close actionIcon" onClick={onClose} />
        <i className={`fas ${timer.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle} />
      </div>
    </div>
  )
}

function DigitalStopwatchItem({ stopwatch, showControls, onClose, onReset, onToggle }) {
  const diffInSeconds = stopwatch.paused
    ? stopwatch.pausedDiff / 1000
    : (Date.now() - stopwatch.markedTime + stopwatch.pausedDiff) / 1000

  const hours   = Math.floor(diffInSeconds / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = Math.floor(diffInSeconds % 60)

  return (
    <div className="digital-item">
      <div className="digital-digit-group digital-digit-group--item">
        {hours > 0 && <>
          <DigitalDigit digit={String(Math.floor(hours / 10))} />
          <DigitalDigit digit={String(hours % 10)} />
          <span className="digit-sep"> </span>
        </>}
        <DigitalDigit digit={String(Math.floor(minutes / 10))} />
        <DigitalDigit digit={String(minutes % 10)} />
        <span className="digit-sep"> </span>
        <DigitalDigit digit={String(Math.floor(seconds / 10))} />
        <DigitalDigit digit={String(seconds % 10)} />
      </div>
      {stopwatch.label && <div className="digital-item-label">{stopwatch.label}</div>}
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset} />
        <i className="far fa-window-close actionIcon" onClick={onClose} />
        <i className={`fas ${stopwatch.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle} />
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────

export default function Digital() {
  const { showSeconds, showMeridum, showDate } = useSettings()
  const {
    showControls,
    timers, stopwatches,
    closeTimer, resetTimer, toggleTimer,
    closeStopwatch, resetStopwatch, toggleStopwatch,
  } = useAppContext()

  const [time, setTime] = useState(new Date())
  const [dateAnimChars, setDateAnimChars] = useState(null)
  const animCleanupRef = useRef([])

  // Clock + timer tick
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])

  // Date scroll animation – runs once on mount
  useEffect(() => {
    if (!showDate) return

    const now = new Date()
    const fullChars  = buildFullDateChars(now)
    const introChars = Array.from({ length: 17 }, () => ' ')

    let combined = [...introChars, ...fullChars]
    setDateAnimChars([...combined])

    const introInterval = setInterval(() => {
      combined = combined.slice(1)
      setDateAnimChars([...combined])

      if (combined.length <= fullChars.length) {
        clearInterval(introInterval)

        const holdTimeout = setTimeout(() => {
          let current = [...fullChars]
          let slashCount = 0
          const popInterval = setInterval(() => {
            current = current.slice(1)
            current.push(' ')
            slashCount++
            const allSlashes = current.every(c => c === '\\' || c === '/' || c === ' ')
            if (allSlashes) {
              clearInterval(popInterval)
              setDateAnimChars(null)
            } else {
              setDateAnimChars([...current])
            }
          }, 350)
          animCleanupRef.current.push(() => clearInterval(popInterval))
        }, 700)

        animCleanupRef.current.push(() => clearTimeout(holdTimeout))
      }
    }, 350)

    animCleanupRef.current.push(() => clearInterval(introInterval))

    return () => {
      animCleanupRef.current.forEach(fn => fn())
      animCleanupRef.current = []
    }
  }, [showDate])

  const h = time.getHours() % 12 || 12
  const m = time.getMinutes()
  const s = time.getSeconds()

  const hasTimers = timers.length > 0 || stopwatches.length > 0

  return (
    <div className="container">
      <div className={`digital-digit-group${hasTimers ? ' digital-digit-group--compact' : ''}`}>
        <DigitalDigit digit={String(Math.floor(h / 10))} />
        <DigitalDigit digit={String(h % 10)} />
        <span className="digit-sep"> </span>
        <DigitalDigit digit={String(Math.floor(m / 10))} />
        <DigitalDigit digit={String(m % 10)} />
        {showSeconds && <>
          <span className="digit-sep"> </span>
          <DigitalDigit digit={String(Math.floor(s / 10))} />
          <DigitalDigit digit={String(s % 10)} />
        </>}
        {showMeridum && <>
          <DigitalDigit digit={time.getHours() >= 12 ? 'P' : 'A'} />
          <DigitalDigit digit="M" />
        </>}
      </div>

      {showDate && (
        <div className="digital-digit-group digital-digit-group--date">
          {dateAnimChars !== null
            ? dateAnimChars.slice(0, 17).map((char, i) => <DigitalDigit key={i} digit={char} />)
            : <>
                <DigitalDigit digit={WEEKDAYS_SHORT[time.getDay()][0]} />
                <DigitalDigit digit={WEEKDAYS_SHORT[time.getDay()][1]} />
                <DigitalDigit digit={WEEKDAYS_SHORT[time.getDay()][2]} />
                <DigitalDigit digit={WEEKDAYS_SHORT[time.getDay()].length < 4 ? ' ' : WEEKDAYS_SHORT[time.getDay()][3]} />
                <DigitalDigit digit=" " />
                <DigitalDigit digit={MONTHS_SHORT[time.getMonth()][0]} />
                <DigitalDigit digit={MONTHS_SHORT[time.getMonth()][1]} />
                <DigitalDigit digit={MONTHS_SHORT[time.getMonth()][2]} />
                <DigitalDigit digit={MONTHS_SHORT[time.getMonth()].length < 4 ? ' ' : MONTHS_SHORT[time.getMonth()][3]} />
                <DigitalDigit digit=" " />
                <DigitalDigit digit={Math.floor(time.getDate() / 10)} />
                <DigitalDigit digit={time.getDate() % 10} />
                <DigitalDigit digit="," />
                <DigitalDigit digit={Math.floor(time.getFullYear() / 1000)} />
                <DigitalDigit digit={Math.floor((time.getFullYear() % 1000) / 100)} />
                <DigitalDigit digit={Math.floor((time.getFullYear() % 100) / 10)} />
                <DigitalDigit digit={time.getFullYear() % 10} />
              </>
          }
        </div>
      )}

      {hasTimers && (
        <div className="digital-timers-section">
          {timers.map(timer => (
            <DigitalTimerItem
              key={timer.id}
              timer={timer}
              showControls={showControls}
              onClose={() => closeTimer(timer.id)}
              onReset={() => resetTimer(timer.id)}
              onToggle={() => toggleTimer(timer.id)}
            />
          ))}
          {stopwatches.map(sw => (
            <DigitalStopwatchItem
              key={sw.id}
              stopwatch={sw}
              showControls={showControls}
              onClose={() => closeStopwatch(sw.id)}
              onReset={() => resetStopwatch(sw.id)}
              onToggle={() => toggleStopwatch(sw.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
