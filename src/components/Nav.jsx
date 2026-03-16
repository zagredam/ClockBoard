import { useState } from 'react'

const NFL_TEAMS = [
  'None', 'MZ', 'ARZ', 'ATL', 'BLT', 'BUF', 'CAR', 'CHI', 'CIN', 'CLV',
  'DAL', 'DEN', 'DET', 'GB', 'HST', 'IND', 'JAX', 'KC', 'LAC', 'LA',
  'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'LV', 'PHI', 'PIT', 'SF',
  'SEA', 'TB', 'TEN', 'WAS',
]

export default function Nav({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  altTheme,
  onAltThemeToggle,
  showDate,
  onDateToggle,
  showSeconds,
  onSecondsToggle,
  showMeridum,
  onMeridumToggle,
  onAddTimer,
  onAddStopwatch,
}) {
  const [timerMinutes, setTimerMinutes] = useState('')
  const [timerSeconds, setTimerSeconds] = useState('')
  const [timerLabel, setTimerLabel] = useState('')
  const [stopwatchLabel, setStopwatchLabel] = useState('')

  const handleAddTimer = () => {
    onAddTimer(timerMinutes, timerSeconds, timerLabel)
  }

  const handleAddStopwatch = () => {
    onAddStopwatch(stopwatchLabel)
  }

  return (
    <div id="nav" className={`overlay${isOpen ? ' show' : ''}`}>
      <div>
        <div style={{ width: '45%', display: 'inline-block', textAlign: 'left', padding: '20px' }}>
          <div className="actionIcon" onClick={onClose}>&times;</div>
        </div>
        <div className="navMenuRow">
          <strong>Theme: </strong>
          <select id="themeSelect" value={theme} onChange={(e) => onThemeChange(e.target.value)}>
            {NFL_TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <label className="switch">
            <input type="checkbox" checked={altTheme} onChange={onAltThemeToggle} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      <div className="navMenuRow">
        <strong>Date: </strong>
        <label className="switch">
          <input type="checkbox" checked={showDate} onChange={onDateToggle} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="navMenuRow">
        <strong>Seconds: </strong>
        <label className="switch">
          <input type="checkbox" checked={showSeconds} onChange={onSecondsToggle} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="navMenuRow">
        <strong>Meridum: </strong>
        <label className="switch">
          <input type="checkbox" checked={showMeridum} onChange={onMeridumToggle} />
          <span className="slider"></span>
        </label>
      </div>
      <div id="addTimerOptions" className="navMenuRow" style={{ fontSize: '2vw' }}>
        <input
          id="timerValueMinute"
          type="text"
          placeholder="Minutes..."
          value={timerMinutes}
          onChange={(e) => setTimerMinutes(e.target.value)}
        />
        :
        <input
          id="timerValueSecond"
          type="text"
          placeholder="Seconds..."
          value={timerSeconds}
          onChange={(e) => setTimerSeconds(e.target.value)}
        />
        <input
          id="timerValueLabel"
          type="text"
          placeholder="Label"
          value={timerLabel}
          onChange={(e) => setTimerLabel(e.target.value)}
        />
        <button id="btnStartTimer" className="timerbutton" onClick={handleAddTimer}>
          Add Timer +
        </button>
      </div>
      <div id="addStopWatchOptions" className="navMenuRow">
        <input
          id="stopwatchValueLabel"
          type="text"
          placeholder="Label"
          value={stopwatchLabel}
          onChange={(e) => setStopwatchLabel(e.target.value)}
        />
        <button id="btnStartStopWatch" className="timerbutton" onClick={handleAddStopwatch}>
          Add Stopwatch +
        </button>
      </div>
    </div>
  )
}
