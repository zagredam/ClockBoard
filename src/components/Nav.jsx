import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Dialog } from '@base-ui/react/dialog'
import { Switch } from '@base-ui/react/switch'
import { Input } from '@base-ui/react/input'
import { Button } from '@base-ui/react/button'
import { RadioGroup } from '@base-ui/react/radio-group'
import { Radio } from '@base-ui/react/radio'
import { NFL_TEAMS, useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'

const CLOCK_TYPES = [
  { label: 'Clock', path: '/clock' },
  { label: 'Flipboard', path: '/flipboard' },
  { label: 'Hourglass', path: '/hourglass' },
]

function loadDefaultRoute() {
  return localStorage.getItem('cb_defaultRoute') || '/clock'
}

export default function Nav({ isOpen, onClose, onAddTimer, onAddStopwatch }) {
  const {
    theme, setTheme,
    altTheme, setAltTheme,
    showDate, setShowDate,
    showSeconds, setShowSeconds,
    showMeridum, setShowMeridum,
    hourglassInterval, setHourglassInterval
  } = useSettings()

  const { containerRef } = useAppContext()

  const navigate = useNavigate()
  const location = useLocation()

  const [defaultRoute, setDefaultRoute] = useState(loadDefaultRoute)

  const [timerMinutes, setTimerMinutes] = useState('')
  const [timerSeconds, setTimerSeconds] = useState('')
  const [timerLabel, setTimerLabel] = useState('')
  const [stopwatchLabel, setStopwatchLabel] = useState('')

  const handleAddTimer = () => onAddTimer(timerMinutes, timerSeconds, timerLabel)
  const handleAddStopwatch = () => onAddStopwatch(stopwatchLabel)

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setAltTheme(false)
  }

  const handleNavigate = (path) => {
    navigate(path)
    onClose()
  }

  const handleDefaultChange = (path) => {
    setDefaultRoute(path)
    localStorage.setItem('cb_defaultRoute', path)
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal container={containerRef.current}>
        <Dialog.Backdrop className="settings-backdrop" />
        <Dialog.Popup className="settings-popup">

          <Dialog.Close className="settings-close">&times;</Dialog.Close>

          <RadioGroup value={defaultRoute} onValueChange={handleDefaultChange} className="clock-type-nav">
            {CLOCK_TYPES.map(({ label, path }) => (
              <div key={path} className="clock-type-item">
                <button
                  className={`clock-type-btn${location.pathname === path ? ' active' : ''}`}
                  onClick={() => {handleNavigate(path);handleDefaultChange(path);}}
                >
                  {label}
                </button>
                {/* <Radio.Root value={path} className="clock-type-radio">
                  <Radio.Indicator className="clock-type-radio-indicator" />
                </Radio.Root> */}
              </div>
            ))}
          </RadioGroup>

          <div className="settings-rows">
            <div className="navMenuRow">
              <strong>Theme</strong>
              <div className="setting-control">
                <select id="themeSelect" value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                  {NFL_TEAMS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <Switch.Root
                  className="settings-switch"
                  checked={altTheme}
                  onCheckedChange={(checked) => setAltTheme(checked)}
                >
                  <Switch.Thumb className="settings-switch-thumb" />
                </Switch.Root>
              </div>
            </div>

            <div className="navMenuRow">
              <strong>Show Date</strong>
              <Switch.Root
                className="settings-switch"
                checked={showDate}
                onCheckedChange={(checked) => setShowDate(checked)}
              >
                <Switch.Thumb className="settings-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="navMenuRow">
              <strong>Show Seconds</strong>
              <Switch.Root
                className="settings-switch"
                checked={showSeconds}
                onCheckedChange={(checked) => setShowSeconds(checked)}
              >
                <Switch.Thumb className="settings-switch-thumb" />
              </Switch.Root>
            </div>

            <div className="navMenuRow">
              <strong>Show AM/PM</strong>
              <Switch.Root
                className="settings-switch"
                checked={showMeridum}
                onCheckedChange={(checked) => setShowMeridum(checked)}
              >
                <Switch.Thumb className="settings-switch-thumb" />
              </Switch.Root>
            </div>
            {location.pathname === "/hourglass" && (
              <div className="navMenuRow">
                <strong>Interval</strong>
                <div className="setting-control">
                  <select id="hourglassSelect" value={hourglassInterval} onChange={(e) => setHourglassInterval(e.target.value)}>
                    <option key={60} value={60}>Per minute</option>
                    <option key={60*5} value={60*5}>Every 5 minutes</option>
                    <option key={60*10} value={60*10}>Every 10 minutes</option>
                    <option key={60*15} value={60*15}>Every 15 minutes</option>
                    <option key={3600} value={3600}>Per hour</option>
                    <option key={86400} value={86400}>Per Day</option>
                    <option key={"monthly"} value={"monthly"}>Monthly</option>
                    <option key={"yearly"} value={"yearly"}>Yearly</option>
                  </select>
                </div>
              </div>
            )}
            {onAddTimer && (
              <div id="addTimerOptions" className="navMenuRow timer-row">
                <strong>Timer</strong>
                <div className="setting-control timer-inputs">
                  <Input
                    className="settings-input settings-input--short"
                    placeholder="Min"
                    value={timerMinutes}
                    onChange={(e) => setTimerMinutes(e.target.value)}
                  />
                  <span className="timer-sep">:</span>
                  <Input
                    className="settings-input settings-input--short"
                    placeholder="Sec"
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(e.target.value)}
                  />
                  <Input
                    className="settings-input"
                    placeholder="Label"
                    value={timerLabel}
                    onChange={(e) => setTimerLabel(e.target.value)}
                  />
                  <Button className="settings-btn" onClick={handleAddTimer}>
                    Add +
                  </Button>
                </div>
              </div>
            )}

            {onAddStopwatch && (
              <div id="addStopWatchOptions" className="navMenuRow">
                <strong>Stopwatch</strong>
                <div className="setting-control">
                  <Input
                    className="settings-input"
                    placeholder="Label"
                    value={stopwatchLabel}
                    onChange={(e) => setStopwatchLabel(e.target.value)}
                  />
                  <Button className="settings-btn" onClick={handleAddStopwatch}>
                    Add +
                  </Button>
                </div>
              </div>
            )}
          </div>

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
