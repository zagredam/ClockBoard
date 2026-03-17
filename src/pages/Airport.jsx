import { useState, useEffect } from 'react'
import FlipDigit from '../components/FlipDigit'
import '../styles/airport.css'
import { useSettings } from '../context/SettingsContext'

export default function Airport() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])

  const h = time.getHours() % 12 || 12;
  const m = time.getMinutes()
  const s = time.getSeconds()
  const { showSeconds, showMeridum, showDate, toggleAltTheme, cycleTheme } = useSettings()
  const style = {  "--dw": showSeconds ? "min(12vw, 55vh)" : "min(18vw, 55vh)" };   /* digit card width; height = dw * 3/2 via aspect-ratio */
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
        <FlipDigit digit={String(Math.floor(s/ 10))} />
        <FlipDigit digit={String(s % 10)} />
        </>}
      </div>
    </div>
  )
}
