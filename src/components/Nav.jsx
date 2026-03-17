import { useState } from 'react'
import { NFL_TEAMS, useSettings } from '../context/SettingsContext'

export default function Nav({ isOpen, onClose, onAddTimer, onAddStopwatch }) {
  const {
    theme, setTheme,
    altTheme, setAltTheme,
    showDate, setShowDate,
    showSeconds, setShowSeconds,
    showMeridum, setShowMeridum,
  } = useSettings()

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

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setAltTheme(false)
  }

  return (
    <div id="nav" className={`overlay${isOpen ? ' show' : ''}`}>
      <div>
        <div style={{ width: '45%', display: 'inline-block', textAlign: 'left', padding: '20px' }}>
          <div className="actionIcon" onClick={onClose}>&times;</div>
        </div>
        <div className="navMenuRow">
          <strong>Theme: </strong>
          <select id="themeSelect" value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
            {NFL_TEAMS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <label className="switch">
            <input type="checkbox" checked={altTheme} onChange={() => setAltTheme(!altTheme)} />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      <div className="navMenuRow">
        <strong>Date: </strong>
        <label className="switch">
          <input type="checkbox" checked={showDate} onChange={() => setShowDate(!showDate)} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="navMenuRow">
        <strong>Seconds: </strong>
        <label className="switch">
          <input type="checkbox" checked={showSeconds} onChange={() => setShowSeconds(!showSeconds)} />
          <span className="slider"></span>
        </label>
      </div>
      <div className="navMenuRow">
        <strong>Meridum: </strong>
        <label className="switch">
          <input type="checkbox" checked={showMeridum} onChange={() => setShowMeridum(!showMeridum)} />
          <span className="slider"></span>
        </label>
      </div>
      {onAddTimer && (
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
      )}
      {onAddStopwatch && (
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
      )}
    </div>
  )
}
