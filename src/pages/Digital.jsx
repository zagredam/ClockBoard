import { useState, useEffect, useCallback } from 'react'
import Clock from '../components/Clock'
import TimersSection from '../components/TimersSection'
import GamepadService from '../GamepadService'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'
import "../styles/digital.css";
let idCounter = 0;
const WEEKDAYS = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE',
  'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC',
]
// slot order: [lt, lb, top, mid-left, mid-right, bot, rt, rb, center-top, center-bottom, diag-ul, diag-ur, diag-ll, diag-lr]
const digitNumberMapping = [
    [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, false], // 0
    [false, false, false, false, false, false, true,  true,  false, false, false, false, false, false], // 1
    [false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, false], // 2
    [false, false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 3
    [true,  false, false, true,  true,  false, true,  true,  false, false, false, false, false, false], // 4
    [true,  false, true,  true,  true,  true,  false, true,  false, false, false, false, false, false], // 5
    [true,  true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false], // 6
    [false, false, true,  false, false, false, true,  true,  false, false, false, false, false, false], // 7
    [true,  true,  true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 8
    [true,  false, true,  true,  true,  true,  true,  true,  false, false, false, false, false, false], // 9
]

const letterSegmentMapping = {
    //       lt     lb     top    ml     mr     bot    rt     rb     ct     cb     dul    dur    dll    dlr
    'A': [true,  true,  true,  true,  true,  false, true,  true,  false, false, false, false, false, false],
    'B': [true,  true,  false, true,  true,  true,  false, true,  false, false, false, false, false, false], // b
    'C': [true,  true,  true,  false, false, true,  false, false, false, false, false, false, false, false],
    'D': [false, false, true,  false, false, true,  true,  true,  true,  true,  false, false, false, false], // center bar = D bump
    'E': [true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false],
    'F': [true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false, false],
    'G': [true,  true,  true,  false, true,  true,  false, true,  false, false, false, false, false, false],
    'H': [true,  true,  false, true,  true,  false, true,  true,  false, false, false, false, false, false],
    'I': [false, false, true,  false, false, true,  false, false, true,  true,  false, false, false, false], // centered
    'J': [false, true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
    'K': [true,  true,  false, true,  false, false, false, false, false, false, false, true,  false, true ], // left + diags
    'L': [true,  true,  false, false, false, true,  false, false, false, false, false, false, false, false],
    'M': [true,  true,  false, false, false, false, true,  true,  false, false, true,  true,  false, false], // outer + upper diags
    'N': [true,  true,  false, false, false, false, true,  true,  false, false, true,  false, false, true ], // outer + / diagonal
    'O': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, false],
    'P': [true,  true, true,  true,  true,  false, true,  false, false, false, false, false, false, false],
    'Q': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, true ], // O + tail
    'R': [true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false, true ], // P + lb + leg
    'S': [true,  false, true,  true,  true,  true,  false, true,  false, false, false, false, false, false],
    'T': [false, false, true,  false, false, false, false, false, true,  true,  false, false, false, false], // top + center stem
    'U': [true,  true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
    'V': [true,  true, false, false, false, false, false,  false, false, false, false, true, true,  false ], // upper outer + lower diags
    'W': [true,  true,  false, false, false, false, true,  true,  false, false, false, false, true,  true ], // outer + lower diags
    'X': [false, false, false, false, false, false, false, false, false, false, true,  true,  true,  true ], // all diags
    'Y': [false, false, false, false, false, false, false, false, false, true,  true,  true,  false, false], // upper diags + center stem
    'Z': [false, false, true,  false, false, true,  false, false, false, false, false, true,  true,  false], // top + \ diag + bottom
}

const DigitalDigit = ({digit}) => {
  const mapping = (isNaN(digit) ? letterSegmentMapping[digit] : digitNumberMapping[digit]) ?? [false, false, false, false, false, false, false,  false,  false, false, false, false, false, false];
  return <div className="digital-digit">
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-left-top      ${mapping[0]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-left-bottom   ${mapping[1]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-horizontal     digital-digit-slot-middle-top    ${mapping[2]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-horizontal-half digital-digit-slot-middle-left  ${mapping[3]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-horizontal-half digital-digit-slot-middle-right ${mapping[4]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-horizontal     digital-digit-slot-middle-bottom ${mapping[5]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-right-top     ${mapping[6]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-right-bottom  ${mapping[7]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-center-top    ${mapping[8]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-vertical       digital-digit-slot-center-bottom ${mapping[9]  && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ul       ${mapping[10] && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ur       ${mapping[11] && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-ll       ${mapping[12] && "active"}`}></div>
    <div className={`digital-digit-slot digital-digit-slot-diagonal       digital-digit-slot-diag-lr       ${mapping[13] && "active"}`}></div>
  </div>
}

export default function Digital() {
  const { showSeconds, showMeridum, showDate } = useSettings()
  const { showControls,   } = useAppContext()

  const [timers, setTimers] = useState([])
  const [stopwatches, setStopwatches] = useState([])

  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])


  const handleAddTimer = useCallback((minutes, seconds, label) => {
    if ((minutes === '' && seconds === '') || isNaN(minutes) || isNaN(seconds)) return
    const timerValue = 60 * 1000 * (Number(minutes) || 0) + 1000 * (Number(seconds) || 0)
    setTimers((prev) => [
      ...prev,
      { id: idCounter++, label, timerValue, timeToExp: Date.now() + timerValue, paused: false, timeLeft: null },
    ])
  }, [])

  const handleAddStopwatch = useCallback((label, startTime) => {
    setStopwatches((prev) => [
      ...prev,
      { id: idCounter++, label, paused: false, markedTime: startTime ?? Date.now(), pausedDiff: 0 },
    ])
  }, [])

  // Register timer/stopwatch callbacks into Nav (via AppContext)
  // useEffect(() => {
  //   setAddTimerHandler({ fn: handleAddTimer })
  //   setAddStopwatchHandler({ fn: handleAddStopwatch })
  //   return () => {
  //     setAddTimerHandler(null)
  //     setAddStopwatchHandler(null)
  //   }
  // }, [handleAddTimer, handleAddStopwatch, setAddTimerHandler, setAddStopwatchHandler])

  // Gamepad setup


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
  
  const h = time.getHours() % 12 || 12;
  const m = time.getMinutes()
  const s = time.getSeconds()
  return (
    <div className="container">
      <div className="digital-digit-group">
          <DigitalDigit digit={String(Math.floor(h / 10))} />
          <DigitalDigit digit={String(h % 10)} />
          <span className="digit-sep"> </span>
          <DigitalDigit digit={String(Math.floor(m / 10))} />
          <DigitalDigit digit={String(m % 10)} />
          {showSeconds && <>
          <span className="digit-sep"> </span>
          <DigitalDigit digit={String(Math.floor(s/ 10))} />
          <DigitalDigit digit={String(s % 10)} />
          </>}
          {showMeridum && <><DigitalDigit digit={time.getHours()>=12 ? "P":"A"} /><DigitalDigit digit="M" /></>}
      
        </div>
     {showDate && <div className="digital-digit-group">
          <DigitalDigit digit={WEEKDAYS[time.getDay()][0] }/>
          <DigitalDigit digit={WEEKDAYS[time.getDay()][1] }/>
          <DigitalDigit digit={WEEKDAYS[time.getDay()][2] }/>
          <DigitalDigit digit={WEEKDAYS[time.getDay()].length < 4 ? " " :WEEKDAYS[time.getDay()][3] }/>
          <DigitalDigit digit=" "/>
          <DigitalDigit digit={MONTHS[time.getMonth()][0] }/>
          <DigitalDigit digit={MONTHS[time.getMonth()][1] }/>
          <DigitalDigit digit={MONTHS[time.getMonth()][2] }/>
          <DigitalDigit digit={MONTHS[time.getMonth()].length < 4 ? " " :MONTHS[time.getMonth()][3] }/>
          <DigitalDigit digit=" "/>
          <DigitalDigit digit={Math.floor(time.getDate() / 10)}/>
          <DigitalDigit digit={time.getDate() % 10}/>
          <DigitalDigit digit=","/>
          <DigitalDigit digit={Math.floor(time.getFullYear() / 1000)}/>
          <DigitalDigit digit={Math.floor((time.getFullYear() % 1000) / 100)}/>
          <DigitalDigit digit={Math.floor((time.getFullYear() % 100) / 10)}/>
          <DigitalDigit digit={time.getFullYear() % 10}/>
        </div>}
      {/* <Clock showSeconds={showSeconds} showMeridum={showMeridum} showDate={showDate} /> */}
      {/* <TimersSection
        timers={timers}
        stopwatches={stopwatches}
        showControls={showControls}
        onCloseTimer={handleCloseTimer}
        onResetTimer={handleResetTimer}
        onToggleTimer={handleToggleTimer}
        onCloseStopwatch={handleCloseStopwatch}
        onResetStopwatch={handleResetStopwatch}
        onToggleStopwatch={handleToggleStopwatch}
      /> */}
    </div>
  )
}
