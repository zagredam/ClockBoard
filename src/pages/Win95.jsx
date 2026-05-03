import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useAppContext } from '../context/AppContext'
import { useSettings } from '../context/SettingsContext'
import '../styles/win95.css'

let zTop = 100

function useDrag(ix, iy) {
  const posRef = useRef({ x: ix, y: iy })
  const [pos, setPos] = useState({ x: ix, y: iy })

  const onMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const sx = e.clientX - posRef.current.x
    const sy = e.clientY - posRef.current.y

    function onMove(ev) {
      const p = { x: ev.clientX - sx, y: ev.clientY - sy }
      posRef.current = p
      setPos({ ...p })
    }
    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }, [])

  return [pos, onMouseDown]
}

function AnalogClock({ time, showSeconds, showAMPM }) {
  function toXY(deg, r) {
    const rad = (deg - 90) * Math.PI / 180
    return { x: 100 + r * Math.cos(rad), y: 100 + r * Math.sin(rad) }
  }

  const h = time.getHours() % 12
  const m = time.getMinutes()
  const s = time.getSeconds()

  const hourTip = toXY(h * 30 + m * 0.5, 52)
  const minTip  = toXY(m * 6, 72)
  const secTip  = toXY(s * 6, 80)
  const secTail = toXY(s * 6 + 180, 14)

  return (
    <svg viewBox="0 0 200 200" className="win95-clock-svg">
      <circle cx="100" cy="100" r="96" fill="white" />

      {/* Hour ticks */}
      {Array.from({ length: 12 }, (_, i) => {
        const p1 = toXY(i * 30, 83), p2 = toXY(i * 30, 93)
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke="#000" strokeWidth="3" strokeLinecap="round" />
      })}

      {/* Minute ticks */}
      {Array.from({ length: 60 }, (_, i) => {
        if (i % 5 === 0) return null
        const p1 = toXY(i * 6, 90), p2 = toXY(i * 6, 93)
        return <line key={`m${i}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
          stroke="#a0a0a0" strokeWidth="1" />
      })}

      {/* Numbers */}
      {[12,1,2,3,4,5,6,7,8,9,10,11].map((n, i) => {
        const p = toXY(i * 30, 72)
        return (
          <text key={n} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="central"
            fontSize="13" fontFamily="Arial, sans-serif" fontWeight="bold" fill="#000">
            {n}
          </text>
        )
      })}

      {/* Hour hand */}
      <line x1="100" y1="100" x2={hourTip.x} y2={hourTip.y}
        stroke="#000" strokeWidth="5" strokeLinecap="round" />
      {/* Minute hand */}
      <line x1="100" y1="100" x2={minTip.x} y2={minTip.y}
        stroke="#000" strokeWidth="3" strokeLinecap="round" />
      {/* Second hand */}
      {showSeconds && <line x1={secTail.x} y1={secTail.y} x2={secTip.x} y2={secTip.y}
        stroke="#c00000" strokeWidth="1.5" strokeLinecap="round" />}

      {/* Center */}
      <circle cx="100" cy="100" r="4" fill="#000" />
      <circle cx="100" cy="100" r="2" fill="#c00000" />
      {showAMPM && <text x={92} y={150}>{time.getHours() > 11 ? "PM" : "AM"}</text>}
    </svg>
  )
}

const MONTH_NAMES = ['January','February','March','April','May','June',
                     'July','August','September','October','November','December']
const DAY_ABBRS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function Calendar({ time }) {
  const year  = time.getFullYear()
  const month = time.getMonth()
  const today = time.getDate()

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <div className="win95-cal">
      <div className="win95-cal-header">{MONTH_NAMES[month]} {year}</div>
      <div className="win95-cal-grid">
        {DAY_ABBRS.map(d => <div key={d} className="win95-cal-dow">{d}</div>)}
        {cells.map((day, i) => (
          <div key={i} className={`win95-cal-day${day === today ? ' win95-cal-today' : ''}`}>
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function TitleBtn({ onClick, title, children }) {
  return (
    <button className="win95-titlebtn" onClick={onClick} title={title}>
      {children}
    </button>
  )
}

function Win95Window({ title, icon, titleBarBtns, ix, iy, children }) {
  const [z, setZ] = useState(() => ++zTop)
  const [pos, dragDown] = useDrag(ix, iy)

  const bringToFront = useCallback(() => setZ(++zTop), [])

  const onTitleDown = useCallback((e) => {
    if (e.target.closest('.win95-title-btns')) return
    dragDown(e)
  }, [dragDown])

  return (
    <div className="win95-window" style={{ left: pos.x, top: pos.y, zIndex: z }} onMouseDown={bringToFront}>
      <div className="win95-titlebar" onMouseDown={onTitleDown}>
        {icon && <i className={`fas fa-${icon} win95-title-icon`} />}
        <span className="win95-title-text">{title}</span>
        <div className="win95-title-btns">{titleBarBtns}</div>
      </div>
      <div className="win95-window-body">{children}</div>
    </div>
  )
}

function formatDuration(sec) {
  const t = Math.max(0, sec)
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = Math.floor(t % 60)
  if (h > 0) return `${h}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

function slotPos(slot) {
  const step = Math.floor(Math.min(window.innerWidth, window.innerHeight) * 0.03)
  return {
    ix: Math.floor(window.innerWidth * 0.35) + slot * step,
    iy: Math.floor(window.innerHeight * 0.08) + slot * step,
  }
}

function TimerWindow({ timer, onClose, onReset, onToggle }) {
  const sec     = timer.paused ? (timer.timeLeft || 0) : (timer.timeToExp - Date.now()) / 1000
  const expired = sec <= 0
  const pct     = expired ? 100 : Math.min(100, (1 - sec / (timer.timerValue / 1000)) * 100)
  const timeStr = formatDuration(sec)
  const { ix, iy } = slotPos(timer.id % 8)

  return (
    <Win95Window
      title={timer.label || 'Timer'}
      icon="hourglass-half"
      ix={ix}
      iy={iy}
      titleBarBtns={<>
        <TitleBtn onClick={onReset} title="Reset">↺</TitleBtn>
        <TitleBtn onClick={onToggle} title={timer.paused ? 'Resume' : 'Pause'}>
          {timer.paused ? '▶' : '⏸'}
        </TitleBtn>
        <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
      </>}
    >
      <div className={`win95-pbar-track${expired ? ' win95-pbar-expired' : ''}`}>
        <div className="win95-pbar-fill" style={{ width: `${pct}%` }} />
        <span className="win95-pbar-lbl">{timeStr}</span>
        <span className="win95-pbar-lbl win95-pbar-lbl-inv"
              style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
          {timeStr}
        </span>
      </div>
    </Win95Window>
  )
}

function StopwatchWindow({ stopwatch, onClose, onReset, onToggle }) {
  const sec = stopwatch.paused
    ? stopwatch.pausedDiff / 1000
    : (Date.now() - stopwatch.markedTime + stopwatch.pausedDiff) / 1000
  const { ix, iy } = slotPos(stopwatch.id % 8)

  return (
    <Win95Window
      title={stopwatch.label || 'Stopwatch'}
      icon="stopwatch"
      ix={ix}
      iy={iy}
      titleBarBtns={<>
        <TitleBtn onClick={onReset} title="Reset">↺</TitleBtn>
        <TitleBtn onClick={onToggle} title={stopwatch.paused ? 'Resume' : 'Pause'}>
          {stopwatch.paused ? '▶' : '⏸'}
        </TitleBtn>
        <TitleBtn onClick={onClose} title="Close">✕</TitleBtn>
      </>}
    >
      <div className="win95-time-display">{formatDuration(sec)}</div>
      {stopwatch.label && <div className="win95-item-label">{stopwatch.label}</div>}
    </Win95Window>
  )
}

export default function Win95() {
  const [time, setTime] = useState(new Date())
  const {
    timers, stopwatches,
    closeTimer, resetTimer, toggleTimer,
    closeStopwatch, resetStopwatch, toggleStopwatch,
  } = useAppContext()
  const { showDate, showSeconds, showMeridum } = useSettings()

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(id)
  }, [])

  // Compute initial position once at mount, accounting for calendar width if shown
  const clockPos = useMemo(() => {
    const face  = Math.min(window.innerWidth * 0.4, window.innerHeight * 0.4)
    const winW  = showDate ? face * 2 + 12 : face
    return {
      x: Math.max(20, Math.floor((window.innerWidth  - winW) / 2)),
      y: Math.max(20, Math.floor((window.innerHeight - face) / 2 - window.innerHeight * 0.04)),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="win95-desktop">
      <Win95Window
        title="Clock"
        icon="clock"
        ix={clockPos.x}
        iy={clockPos.y}
        titleBarBtns={<>
          <TitleBtn title="Minimize">_</TitleBtn>
          <TitleBtn title="Maximize">□</TitleBtn>
          <TitleBtn title="Close">✕</TitleBtn>
        </>}
      >
        <div className="win95-clock-body">
          {showDate && <Calendar time={time} />}
          <AnalogClock showSeconds={showSeconds} showAMPM={showMeridum} time={time} />
        </div>
      </Win95Window>

      {timers.map((timer) => (
        <TimerWindow
          key={timer.id}
          timer={timer}
          onClose={() => closeTimer(timer.id)}
          onReset={() => resetTimer(timer.id)}
          onToggle={() => toggleTimer(timer.id)}
        />
      ))}

      {stopwatches.map((sw) => (
        <StopwatchWindow
          key={sw.id}
          stopwatch={sw}
          onClose={() => closeStopwatch(sw.id)}
          onReset={() => resetStopwatch(sw.id)}
          onToggle={() => toggleStopwatch(sw.id)}
        />
      ))}
    </div>
  )
}
