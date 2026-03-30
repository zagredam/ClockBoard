export default function Timer({ timer, tick, showControls, onClose, onReset, onToggle }) {
  const diffInSeconds = timer.paused
    ? (timer.timeLeft || 0)
    : (timer.timeToExp - Date.now()) / 1000

  const expired = diffInSeconds < 0

  const hours = expired ? 0 : Math.floor(diffInSeconds / 3600)
  const minutes = expired ? 0 : Math.floor((diffInSeconds % 3600) / 60)
  const seconds = expired ? 0 : Math.floor(diffInSeconds % 60)

  const hoursStr = hours > 0 ? `${hours}:` : ''
  const minutesStr = `${minutes < 10 ? '0' : ''}${minutes}:`
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`

  return (
    <div className="timer">
      <div className={`timerValues ${expired ? ' timerComplete' : ''}`}>
        <div className="timeSection timerHour">{hoursStr}</div>
        <div className="timeSection timerMinute">{minutesStr}</div>
        <div className="timeSection timerSecond">{secondsStr}</div>
      </div>
      <div className="timerLabel">{timer.label}</div>
      <div className={`buttons${showControls ? ' show' : ''}`}>
        <i className="fas fa-undo-alt actionIcon" onClick={onReset}></i>
        <i className="far fa-window-close actionIcon" onClick={onClose}></i>
        <i className={`fas ${timer.paused ? 'fa-play' : 'fa-pause'} actionIcon`} onClick={onToggle}></i>
      </div>
    </div>
  )
}
