import { useState, useEffect, useRef } from 'react'
import TimersSection from '../components/TimersSection'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'
import "../styles/digital.css";

const WEEKDAYS_SHORT = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const WEEKDAYS_FULL  = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']
const MONTHS_SHORT   = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE', 'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC']
const MONTHS_FULL    = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

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
    'B': [true,  true,  false, true,  true,  true,  false, true,  false, false, false, false, false, false],
    'C': [true,  true,  true,  false, false, true,  false, false, false, false, false, false, false, false],
    'D': [false, false, true,  false, false, true,  true,  true,  true,  true,  false, false, false, false],
    'E': [true,  true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false],
    'F': [true,  true,  true,  true,  true,  false, false, false, false, false, false, false, false, false],
    'G': [true,  true,  true,  false, true,  true,  false, true,  false, false, false, false, false, false],
    'H': [true,  true,  false, true,  true,  false, true,  true,  false, false, false, false, false, false],
    'I': [false, false, true,  false, false, true,  false, false, true,  true,  false, false, false, false],
    'J': [false, true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
    'K': [true,  true,  false, true,  false, false, false, false, false, false, false, true,  false, true ],
    'L': [true,  true,  false, false, false, true,  false, false, false, false, false, false, false, false],
    'M': [true,  true,  false, false, false, false, true,  true,  false, false, true,  true,  false, false],
    'N': [true,  true,  false, false, false, false, true,  true,  false, false, true,  false, false, true ],
    'O': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, false],
    'P': [true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false, false],
    'Q': [true,  true,  true,  false, false, true,  true,  true,  false, false, false, false, false, true ],
    'R': [true,  true,  true,  true,  true,  false, true,  false, false, false, false, false, false, true ],
    'S': [true,  false, true,  true,  true,  true,  false, true,  false, false, false, false, false, false],
    'T': [false, false, true,  false, false, false, false, false, true,  true,  false, false, false, false],
    'U': [true,  true,  false, false, false, true,  true,  true,  false, false, false, false, false, false],
    'V': [true,  true,  false, false, false, false, false, false, false, false, false, true,  true,  false],
    'W': [true,  true,  false, false, false, false, true,  true,  false, false, false, false, true,  true ],
    'X': [false, false, false, false, false, false, false, false, false, false, true,  true,  true,  true ],
    'Y': [false, false, false, false, false, false, false, false, false, true,  true,  true,  false, false],
    'Z': [false, false, true,  false, false, true,  false, false, false, false, false, true,  true,  false],
    '-': [false, false, false, true,  true,  false, false, false, false, false, false, false, false, false],
}

const DigitalDigit = ({digit}) => {
  const mapping = (isNaN(digit) ? letterSegmentMapping[digit] : digitNumberMapping[digit]) ?? [false, false, false, false, false, false, false, false, false, false, false, false, false, false];
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

// Matches the number of DigitalDigit elements in the static abbreviated display:
// 4 weekday + 1 space + 4 month + 1 space + 2 date + 1 comma + 4 year = 17
const MIN_DATE_DIGITS = 17
const DATE_FRONT_PAD = Array(MIN_DATE_DIGITS).fill(' ')
const DATE_BACK_PAD  = Array(4).fill(' ')

function buildFullDateChars(date) {
  const day   = WEEKDAYS_FULL[date.getDay()].split('')
  const month = MONTHS_FULL[date.getMonth()].split('')
  const d1    = String(Math.floor(date.getDate() / 10))
  const d2    = String(date.getDate() % 10)
  const y     = String(date.getFullYear()).split('')
  return [...day, ' ', ...month, ' ', d1, d2, ',', ' ', ...y]
}

export default function Digital() {
  const { showSeconds, showMeridum, showDate } = useSettings()
  const {
    showControls,
    timers, stopwatches,
    closeTimer, resetTimer, toggleTimer,
    closeStopwatch, resetStopwatch, toggleStopwatch,
  } = useAppContext()

  const [time, setTime] = useState(new Date())

  // dateAnimChars: null = show normal abbreviated display (17 digits)
  // otherwise: array of chars to render as DigitalDigit components
  const [dateAnimChars, setDateAnimChars] = useState(null)
  const animCleanupRef = useRef([])

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])

  // Date scroll animation – runs once on mount
  useEffect(() => {
    if (!showDate) return

    const now = new Date()
    const fullChars    = buildFullDateChars(now)
    // Pad full date with leading and trailing blanks so the row never shrinks
    // below MIN_DATE_DIGITS during the pop phase
    const paddedChars  = [...DATE_FRONT_PAD, ...fullChars, ...DATE_BACK_PAD]
    const introChars   = paddedChars.map((_, i) => i % 2 === 0 ? 'X' : '-')

    // Phase 1: alternating X / — (same width as padded full date)
    setDateAnimChars(introChars)

    // Phase 2: full expanded (padded) date after 700 ms
    const t1 = setTimeout(() => {
      setDateAnimChars([...paddedChars])

      // Phase 3: pop characters off the right end every 350 ms;
      // stop once only the front-pad blanks remain (length === MIN_DATE_DIGITS)
      let remaining = [...paddedChars]
      const popInterval = setInterval(() => {
        remaining = remaining.slice(0, -1)
        if (remaining.length <= MIN_DATE_DIGITS && remaining.every(c => c === ' ')) {
          clearInterval(popInterval)
          setDateAnimChars(null) // Phase 4: back to normal abbreviated display
        } else {
          setDateAnimChars([...remaining])
        }
      }, 350)

      animCleanupRef.current.push(() => clearInterval(popInterval))
    }, 700)

    animCleanupRef.current.push(() => clearTimeout(t1))

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
            ? dateAnimChars.map((char, i) => <DigitalDigit key={i} digit={char} />)
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
      )}
    </div>
  )
}
