import { useState, useEffect } from 'react'
import FlipDigit from '../components/FlipDigit'
import '../styles/airport.css'
import { useSettings } from '../context/SettingsContext'
const WEEKDAYS = ['SUN', 'MON', 'TUES', 'WED', 'THURS', 'FRI', 'SAT']
const MONTHS = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUNE',
  'JULY', 'AUG', 'SEPT', 'OCT', 'NOV', 'DEC',
]
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
  const style = {  "--dw": showSeconds ? "min(11vw, 52vh)" : "min(18vw, 55vh)" };   /* digit card width; height = dw * 3/2 via aspect-ratio */
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
        {showMeridum && <div className="airport-meridum"><span style={time.getHours() < 12 ? { color: 'var(--primaryColor)' } : { color: 'grey',opacity: 0.5 }}>&bull;</span>AM<br/>
      <span style={time.getHours() > 12 ? { color: 'var(--primaryColor)' } : { color: 'grey',opacity: 0.5 }}>&bull;</span>PM
    
      </div>}
      </div>
       {showDate &&<div className="airport-clock" style={{"--dw": "min(4vw, 12vh)",marginTop: "3vh"}}>
        <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][0] }/>
        <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][1] }/>
        <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()][2] }/>
        <FlipDigit fastFlip digit={WEEKDAYS[time.getDay()].length < 4 ? " " :WEEKDAYS[time.getDay()][3] }/>
        <FlipDigit fastFlip digit=" "/>
        <FlipDigit fastFlip digit={MONTHS[time.getMonth()][0] }/>
        <FlipDigit fastFlip digit={MONTHS[time.getMonth()][1] }/>
        <FlipDigit fastFlip digit={MONTHS[time.getMonth()][2] }/>
        <FlipDigit fastFlip digit={MONTHS[time.getMonth()].length < 4 ? " " :MONTHS[time.getMonth()][3] }/>
        <FlipDigit fastFlip digit=" "/>
        <FlipDigit fastFlip flipThroughLetters digit={Math.floor(time.getDate() / 10)}/>
        <FlipDigit fastFlip flipThroughLetters digit={time.getDate() % 10}/>
        <FlipDigit fastFlip digit=","/>
        <FlipDigit fastFlip flipThroughLetters digit={Math.floor(time.getFullYear() / 1000)}/>
        <FlipDigit fastFlip flipThroughLetters digit={Math.floor((time.getFullYear() % 1000) / 100)}/>
        <FlipDigit fastFlip flipThroughLetters digit={Math.floor((time.getFullYear() % 100) / 10)}/>
        <FlipDigit fastFlip flipThroughLetters digit={time.getFullYear() % 10}/>
       </div>}
    </div>
  )
}
