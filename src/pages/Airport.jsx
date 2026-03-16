import { useState, useEffect } from 'react'
import FlipDigit from '../components/FlipDigit'
import '../styles/airport.css'

export default function Airport() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])

  const h = time.getHours()
  const m = time.getMinutes()

  return (
    <div className="airport-bg">
      <div className="airport-clock">
        <FlipDigit digit={String(Math.floor(h / 10))} />
        <FlipDigit digit={String(h % 10)} />
        <span className="airport-sep">:</span>
        <FlipDigit digit={String(Math.floor(m / 10))} />
        <FlipDigit digit={String(m % 10)} />
      </div>
    </div>
  )
}
