export default function Stopwatch({ stopwatch, showControls, onClose, onReset, onToggle }) {
  const diffInSeconds = stopwatch.paused
    ? stopwatch.pausedDiff / 1000
    : (Date.now() - stopwatch.markedTime + stopwatch.pausedDiff) / 1000

  const hours = Math.floor(diffInSeconds / 3600)
  const minutes = Math.floor((diffInSeconds % 3600) / 60)
  const seconds = Math.floor(diffInSeconds % 60)

  const hoursStr = hours > 0 ? `${hours}:` : ''
  const minutesStr = `${minutes < 10 ? '0' : ''}${minutes}:`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return (
    <div className="timer">
      <div className="timerValues">
        <div className="timeSection timerHour">{hoursStr}</div>
        <div className="timeSection timerMinute">{minutesStr}</div>
        <div className="timeSection timerSecond">{secondsStr}</div>
      </div>
      <div className="timerLabel">{stopwatch.label}</div>
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset}></i>
        <i className="far fa-window-close actionIcon" onClick={onClose}></i>
        <i className={`fas ${stopwatch.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle}></i>
      </div>
    </div>
  )
}
