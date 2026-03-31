import { useState, useEffect } from 'react'
import FlipDigit from '../components/FlipDigit'
import FlipLabel from '../components/FlipLabel'
import '../styles/airport.css'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'

const WEEKDAYS = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE',
  'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC',
]

function pad2(n) { return String(Math.max(0, n)).padStart(2, '0') }
function pad3(n) { return String(Math.min(999, Math.max(0, n))).padStart(3, '0') }

function breakTime(totalSeconds) {
  const t = Math.max(0, Math.floor(totalSeconds))
  return {
    days:    Math.floor(t / 86400),
    hours:   Math.floor((t % 86400) / 3600),
    minutes: Math.floor((t % 3600) / 60),
    seconds: t % 60,
  }
}

function BoardRow({ item, type, now, onClose, onReset, onToggle }) {
  let totalSeconds
  if (type === 'timer') {
    totalSeconds = item.paused
      ? item.timeLeft
      : Math.max(0, (item.timeToExp - now) / 1000)
  } else {
    totalSeconds = item.paused
      ? item.pausedDiff / 1000
      : (now - item.markedTime + item.pausedDiff) / 1000
  }

  const { days, hours, minutes, seconds } = breakTime(totalSeconds)
  const label = item.label || (type === 'timer' ? 'TIMER' : 'WATCH')

  return (
    <div className="board-row">
      <FlipLabel label={label} />
      <div className="board-digits board-digits--3">
        {pad3(days).split('').map((ch, i) => <FlipDigit key={i} digit={ch} />)}
      </div>
      <span className="board-sep">:</span>
      <div className="board-digits board-digits--2">
        {pad2(hours).split('').map((ch, i) => <FlipDigit key={i} digit={ch} />)}
      </div>
      <span className="board-sep">:</span>
      <div className="board-digits board-digits--2">
        {pad2(minutes).split('').map((ch, i) => <FlipDigit key={i} digit={ch} />)}
      </div>
      <span className="board-sep">:</span>
      <div className="board-digits board-digits--2">
        {pad2(seconds).split('').map((ch, i) => <FlipDigit key={i} digit={ch} />)}
      </div>
      <div className="board-row-controls">
        <i className="fas fa-undo-alt actionIcon" onClick={onReset} />
        <i className="far fa-window-close actionIcon" onClick={onClose} />
        <i className={`fas ${item.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle} />
      </div>
    </div>
  )
}

function DateRow({ time, dw, mt }) {
  return (
    <div className="airport-clock" style={{ "--dw": dw, marginTop: mt }}>
      <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][0]} />
      <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][1]} />
      <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][2]} />
      <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()].length < 4 ? ' ' : WEEKDAYS[time.getDay()][3]} />
      <FlipDigit fastFlip digit=" " />
      <FlipDigit fastFlip digit={MONTHS[time.getMonth()][0]} />
      <FlipDigit fastFlip digit={MONTHS[time.getMonth()][1]} />
      <FlipDigit fastFlip digit={MONTHS[time.getMonth()][2]} />
      <FlipDigit fastFlip digit={MONTHS[time.getMonth()].length < 4 ? ' ' : MONTHS[time.getMonth()][3]} />
      <FlipDigit fastFlip digit=" " />
      <FlipDigit fastFlip flipThroughLetters digit={Math.floor(time.getDate() / 10)} />
      <FlipDigit fastFlip flipThroughLetters digit={time.getDate() % 10} />
      <FlipDigit fastFlip digit="," />
      <FlipDigit fastFlip flipThroughLetters digit={Math.floor(time.getFullYear() / 1000)} />
      <FlipDigit fastFlip flipThroughLetters digit={Math.floor((time.getFullYear() % 1000) / 100)} />
      <FlipDigit fastFlip flipThroughLetters digit={Math.floor((time.getFullYear() % 100) / 10)} />
      <FlipDigit fastFlip flipThroughLetters digit={time.getFullYear() % 10} />
    </div>
  )
}

export default function Airport() {
  const [time, setTime] = useState(new Date())
  const [now, setNow] = useState(Date.now())

  const {
    timers, stopwatches,
    closeTimer, resetTimer, toggleTimer,
    closeStopwatch, resetStopwatch, toggleStopwatch,
  } = useAppContext()
  const { showSeconds, showMeridum, showDate } = useSettings()

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
      setNow(Date.now())
    }, 200)
    return () => clearInterval(interval)
  }, [])

  const h = time.getHours() % 12 || 12
  const m = time.getMinutes()
  const s = time.getSeconds()

  const hasItems = timers.length > 0 || stopwatches.length > 0

  /* ── No timers/stopwatches: original centered layout ── */
  if (!hasItems) {
    const style = { "--dw": showSeconds ? "min(11vw, 52vh)" : "min(18vw, 55vh)" }
    return (
      <div className="airport-bg" style={style}>
        <div className="airport-clock">
          <FlipDigit digit={String(Math.floor(h / 10))} />
          <FlipDigit digit={String(h % 10)} />
          <span className="airport-sep">:</span>
          <FlipDigit digit={String(Math.floor(m / 10))} />
          <FlipDigit digit={String(m % 10)} />
          {showSeconds && <>
            <span className="airport-sep">:</span>
            <FlipDigit digit={String(Math.floor(s / 10))} />
            <FlipDigit digit={String(s % 10)} />
          </>}
          {showMeridum && (
            <div className="airport-meridum">
              <span style={time.getHours() < 12 ? { color: 'var(--secondaryColor)' } : { color: 'grey', opacity: 0.5 }}>&bull;</span>AM<br />
              <span style={time.getHours() > 12 ? { color: 'var(--secondaryColor)' } : { color: 'grey', opacity: 0.5 }}>&bull;</span>PM
            </div>
          )}
        </div>
        {showDate && <DateRow time={time} dw="min(4vw, 12vh)" mt="3vh" />}
      </div>
    )
  }

  /* ── Board layout with timer/stopwatch rows ── */
  const allItems = [
    ...timers.map(t => ({ ...t, type: 'timer' })),
    ...stopwatches.map(sw => ({ ...sw, type: 'stopwatch' })),
  ]

  return (
    <div className="airport-bg airport-bg--board">
      <div className="board-container" style={{ "--dw": "min(4vw, 7vh)" }}>
        {/* Header row */}
        <div className="board-row board-row--header">
          <div className="board-digits board-digits--name">
            <span className="board-hdr">NAME</span>
          </div>
          <div className="board-digits board-digits--3">
            <span className="board-hdr">DAYS</span>
          </div>
          <span className="board-sep board-sep--ghost">:</span>
          <div className="board-digits board-digits--2">
            <span className="board-hdr">HRS</span>
          </div>
          <span className="board-sep board-sep--ghost">:</span>
          <div className="board-digits board-digits--2">
            <span className="board-hdr">MIN</span>
          </div>
          <span className="board-sep board-sep--ghost">:</span>
          <div className="board-digits board-digits--2">
            <span className="board-hdr">SEC</span>
          </div>
        </div>

        {allItems.map(item => (
          <BoardRow
            key={item.id}
            item={item}
            type={item.type}
            now={now}
            onClose={() => item.type === 'timer' ? closeTimer(item.id) : closeStopwatch(item.id)}
            onReset={() => item.type === 'timer' ? resetTimer(item.id) : resetStopwatch(item.id)}
            onToggle={() => item.type === 'timer' ? toggleTimer(item.id) : toggleStopwatch(item.id)}
          />
        ))}
      </div>

      {/* Small clock bottom-right */}
      <div className="airport-corner" style={{ "--dw": "min(3vw, 5vh)" }}>
        <div className="airport-clock">
          <FlipDigit digit={String(Math.floor(h / 10))} />
          <FlipDigit digit={String(h % 10)} />
          <span className="airport-sep">:</span>
          <FlipDigit digit={String(Math.floor(m / 10))} />
          <FlipDigit digit={String(m % 10)} />
          {showSeconds && <>
            <span className="airport-sep">:</span>
            <FlipDigit digit={String(Math.floor(s / 10))} />
            <FlipDigit digit={String(s % 10)} />
          </>}
          {showMeridum && (
            <div className="airport-meridum airport-meridum--corner">
              <span style={time.getHours() < 12 ? { color: 'var(--primaryColor)' } : { color: 'grey', opacity: 0.5 }}>&bull;</span>AM<br />
              <span style={time.getHours() >= 12 ? { color: 'var(--primaryColor)' } : { color: 'grey', opacity: 0.5 }}>&bull;</span>PM
            </div>
          )}
        </div>
        {showDate && <DateRow time={time} dw="min(1.8vw, 3vh)" mt="0.5vh" />}
      </div>
    </div>
  )
}
