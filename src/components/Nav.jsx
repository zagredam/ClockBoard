import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Dialog } from '@base-ui/react/dialog'
import { Switch } from '@base-ui/react/switch'
import { Input } from '@base-ui/react/input'
import { Button } from '@base-ui/react/button'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'

const CLOCK_TYPES = [
  { label: 'Flipboard', path: '/flipboard' },
  { label: 'Simple', path: '/clock' },
  { label: 'Digital', path: '/digital' },
  { label: 'Hourglass', path: '/hourglass' },
]

function loadDefaultRoute() {
  return localStorage.getItem('cb_defaultRoute') || '/clock'
}

function localDatetimeNow() {
  const d = new Date()
  d.setSeconds(0, 0)
  return d.toISOString().slice(0, 16)
}

const emptyTimer = () => ({ mode: 'duration', minutes: '', seconds: '', targetDate: localDatetimeNow(), label: '' })
const emptyStopwatch = () => ({ mode: 'now', startDate: localDatetimeNow(), label: '' })

function TimersTab({ onAddTimer }) {
  const [rows, setRows] = useState([emptyTimer()])

  const update = (i, field, value) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))

  const removeRow = (i) =>
    setRows(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)

  const addAll = () => {
    rows.forEach(r => {
      if (r.mode === 'date') {
        const ms = new Date(r.targetDate).getTime() - Date.now()
        if (ms <= 0) return
        onAddTimer(Math.floor(ms / 60000), Math.floor((ms % 60000) / 1000), r.label)
      } else {
        onAddTimer(r.minutes, r.seconds, r.label)
      }
    })
    setRows([emptyTimer()])
  }

  const QUICK_TIMERS = [
    { label: '20 secs', minutes: 0, seconds: 20, name: '20 SECS' },
    { label: '5 mins',  minutes: 5, seconds: 0,  name: '5 MINS'  },
    { label: '25 mins', minutes: 25, seconds: 0, name: '25 MINS' },
    { label: '1 hour', minutes: 60, seconds: 0, name: '1 HR'   },
  ]

  return (
    <div className="tab-content">
      <div className="quick-add-row">
        {QUICK_TIMERS.map(({ label, minutes, seconds, name }) => (
          <button key={label} className="settings-btn quick-add-btn" onClick={() => onAddTimer(minutes, seconds, name)}>
            {label}
          </button>
        ))}
      </div>
      {rows.map((row, i) => (
        <div key={i} className="navMenuRow timer-row">
          <button
            className={`mode-toggle${row.mode === 'duration' ? ' active' : ''}`}
            onClick={() => update(i, 'mode', 'duration')}
            title="Duration"
          >⏱</button>
          <button
            className={`mode-toggle${row.mode === 'date' ? ' active' : ''}`}
            onClick={() => update(i, 'mode', 'date')}
            title="Countdown to date"
          >📅</button>
          {row.mode === 'duration' ? <>
            <Input
              className="settings-input settings-input--short"
              placeholder="Min"
              value={row.minutes}
              onChange={e => update(i, 'minutes', e.target.value)}
            />
            <span className="timer-sep">:</span>
            <Input
              className="settings-input settings-input--short"
              placeholder="Sec"
              value={row.seconds}
              onChange={e => update(i, 'seconds', e.target.value)}
            />
          </> : <>
            <input
              type="datetime-local"
              className="settings-input settings-input--date"
              value={row.targetDate}
              onChange={e => update(i, 'targetDate', e.target.value)}
            />
          </>}
          <Input
            className="settings-input"
            placeholder="Label"
            value={row.label}
            onChange={e => update(i, 'label', e.target.value)}
          />
          <button className="settings-btn-icon" onClick={() => removeRow(i)}>✕</button>
        </div>
      ))}
      <div className="tab-actions">
        <Button className="settings-btn" onClick={() => setRows(prev => [...prev, emptyTimer()])}>+ Row</Button>
        <Button className="settings-btn settings-btn--primary" onClick={addAll}>Add All</Button>
      </div>
    </div>
  )
}

function StopwatchesTab({ onAddStopwatch }) {
  const [rows, setRows] = useState([emptyStopwatch()])

  const update = (i, field, value) =>
    setRows(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: value } : r))

  const removeRow = (i) =>
    setRows(prev => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev)

  const addAll = () => {
    rows.forEach(r => {
      const startTime = r.mode === 'date' ? new Date(r.startDate).getTime() : undefined
      onAddStopwatch(r.label, startTime)
    })
    setRows([emptyStopwatch()])
  }

  return (
    <div className="tab-content">
      {rows.map((row, i) => (
        <div key={i} className="navMenuRow">
          <button
            className={`mode-toggle${row.mode === 'now' ? ' active' : ''}`}
            onClick={() => update(i, 'mode', 'now')}
            title="Start now"
          >⏱</button>
          <button
            className={`mode-toggle${row.mode === 'date' ? ' active' : ''}`}
            onClick={() => update(i, 'mode', 'date')}
            title="Start from past date"
          >📅</button>
          {row.mode === 'date' && (
            <input
              type="datetime-local"
              className="settings-input settings-input--date"
              value={row.startDate}
              onChange={e => update(i, 'startDate', e.target.value)}
            />
          )}
          <Input
            className="settings-input"
            placeholder="Label"
            value={row.label}
            onChange={e => update(i, 'label', e.target.value)}
          />
          <button className="settings-btn-icon" onClick={() => removeRow(i)}>✕</button>
        </div>
      ))}
      <div className="tab-actions">
        <Button className="settings-btn" onClick={() => setRows(prev => [...prev, emptyStopwatch()])}>+ Row</Button>
        <Button className="settings-btn settings-btn--primary" onClick={addAll}>Add All</Button>
      </div>
    </div>
  )
}

export default function Nav({ isOpen, onClose, onAddTimer, onAddStopwatch }) {
  const {
    theme, setTheme,
    altTheme, setAltTheme,
    showDate, setShowDate,
    showSeconds, setShowSeconds,
    showMeridum, setShowMeridum,
    hourglassInterval, setHourglassInterval,
    themeOptions,
    customThemes, setCustomThemes
  } = useSettings()

  const { containerRef } = useAppContext()
  const navigate = useNavigate()
  const location = useLocation()

  const [defaultRoute, setDefaultRoute] = useState(loadDefaultRoute)
  const [activeTab, setActiveTab] = useState('settings')

  const foundCustom = customThemes.find(c => c.id === 'Custom')
  const [primaryCustomColor, setPrimaryCustomColor] = useState(foundCustom?.primaryColor ?? '#000000')
  const [secondaryCustomColor, setSecondaryCustomColor] = useState(foundCustom?.secondaryColor ?? '#FFFFFF')

  useEffect(() => {
    if (theme === 'Custom') {
      const timeout = setTimeout(() => {
        setCustomThemes([{
          id: 'Custom',
          primaryColor: primaryCustomColor,
          secondaryColor: secondaryCustomColor
        }, ...customThemes.filter(c => c.id !== 'Custom')])
      }, 1000)
      return () => clearTimeout(timeout)
    }
  }, [primaryCustomColor, secondaryCustomColor])

  const handleThemeChange = (newTheme) => { setTheme(newTheme); setAltTheme(false) }
  const handleNavigate = (path) => { navigate(path); onClose() }
  const handleDefaultChange = (path) => { setDefaultRoute(path); localStorage.setItem('cb_defaultRoute', path) }

  const tabs = [
    { id: 'settings', label: 'Settings' },
    ...(onAddTimer ? [{ id: 'timers', label: 'Timers' }] : []),
    ...(onAddStopwatch ? [{ id: 'stopwatches', label: 'Stopwatches' }] : []),
  ]

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
                  onClick={() => { handleNavigate(path); handleDefaultChange(path) }}
                >
                  {label}
                </button>
              </div>
            ))}
          </RadioGroup>

          <div className="dialog-tabs">
            {tabs.map(t => (
              <button
                key={t.id}
                className={`dialog-tab${activeTab === t.id ? ' active' : ''}`}
                onClick={() => setActiveTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === 'settings' && (
            <div className="settings-rows">
              <div className="navMenuRow">
                <strong>Theme</strong>
                <div className="setting-control">
                  <select id="themeSelect" value={theme} onChange={(e) => handleThemeChange(e.target.value)}>
                    <option value="Custom">Custom</option>
                    {themeOptions.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
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
              {theme === 'Custom' && (
                <div className="navMenuRow">
                  <strong>Custom</strong>
                  <input type="color" value={primaryCustomColor}
                    onChange={e => setPrimaryCustomColor(e.target.value)}
                    style={{ width: '60px', height: '40px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                  <input type="color" value={secondaryCustomColor}
                    onChange={e => setSecondaryCustomColor(e.target.value)}
                    style={{ width: '60px', height: '40px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              )}
              <div className="navMenuRow">
                <strong>Show Date</strong>
                <Switch.Root className="settings-switch" checked={showDate} onCheckedChange={setShowDate}>
                  <Switch.Thumb className="settings-switch-thumb" />
                </Switch.Root>
              </div>
              <div className="navMenuRow">
                <strong>Show Seconds</strong>
                <Switch.Root className="settings-switch" checked={showSeconds} onCheckedChange={setShowSeconds}>
                  <Switch.Thumb className="settings-switch-thumb" />
                </Switch.Root>
              </div>
              <div className="navMenuRow">
                <strong>Show AM/PM</strong>
                <Switch.Root className="settings-switch" checked={showMeridum} onCheckedChange={setShowMeridum}>
                  <Switch.Thumb className="settings-switch-thumb" />
                </Switch.Root>
              </div>
              {location.pathname === '/hourglass' && (
                <div className="navMenuRow">
                  <strong>Interval</strong>
                  <div className="setting-control">
                    <select id="hourglassSelect" value={hourglassInterval} onChange={(e) => setHourglassInterval(e.target.value)}>
                      <option value={60}>Per minute</option>
                      <option value={60*5}>Every 5 minutes</option>
                      <option value={60*10}>Every 10 minutes</option>
                      <option value={60*15}>Every 15 minutes</option>
                      <option value={3600}>Per hour</option>
                      <option value={86400}>Per Day</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'timers' && <TimersTab onAddTimer={onAddTimer} />}
          {activeTab === 'stopwatches' && <StopwatchesTab onAddStopwatch={onAddStopwatch} />}

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
