import { useState, useEffect } from 'react'

const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const schedule = []

export default function Clock({ showSeconds, showMeridum, showDate }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 200)
    return () => clearInterval(interval)
  }, [])

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const meridium = hours >= 12 ? 'pm' : 'am'
  const hours12 = hours % 12 || 12
  const showTens = hours12 >= 10

  const dateStr = `${WEEKDAYS[time.getDay()]}, ${MONTHS[time.getMonth()]} ${time.getDate()}, ${time.getFullYear()}`

  const notifications = schedule.flatMap((x) => {
    const now = time
    if (x.Time >= now) {
      if (x.Time - now < 60 * 60 * 1000) {
        const mins = Math.floor((x.Time - now) / (60 * 1000))
        return [{ text: `${x.Description} in ${mins === 0 ? 'Seconds+' : `${mins} mins`}`, overdue: false }]
      }
      const timeStr = x.Time.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })
      return [{ text: `${x.Description} at ${timeStr}`, overdue: false }]
    } else if (now - x.Time < 1000 * 60 * 10) {
      const mins = Math.floor((now - x.Time) / (60 * 1000))
      return [{ text: `${x.Description} ${mins} mins overdue`, overdue: true }]
    }
    return []
  })

  return (
    <div id="presentationClock">
      <div className="time timeSection">
        {showTens && (
          <div className="timeSection" id="clockHourDigit1">{Math.floor(hours12 / 10)}</div>
        )}
        {hours12 % 10}:{Math.floor(minutes / 10)}{minutes % 10}
        {showSeconds && (
          <span id="secondsSpan">
            :{Math.floor(seconds / 10)}{seconds % 10}
          </span>
        )}
        {showMeridum && (
          <div className="timeSection" id="clockMeridium">{meridium}</div>
        )}
      </div>
      {showDate && (
        <div id="dateContent" className="notifications">{dateStr}</div>
      )}
      <div id="notifications" className="notifications">
        {notifications.map((n, i) => (
          <div key={i} className={`notification${n.overdue ? ' overdue' : ''}`}>{n.text}</div>
        ))}
      </div>
    </div>
  )
}
