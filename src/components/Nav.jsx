import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Dialog } from '@base-ui/react/dialog'
import { Switch } from '@base-ui/react/switch'
import { Input } from '@base-ui/react/input'
import { Button } from '@base-ui/react/button'
import { RadioGroup } from '@base-ui/react/radio-group'
import { useSettings } from '../context/SettingsContext'
import { useAppContext } from '../context/AppContext'
import { useServerContext } from '../context/ServerContext'

const BASE_CLOCK_TYPES = [
  { label: 'Flipboard', path: '/flipboard' },
  { label: 'Simple',    path: '/clock' },
  { label: 'Digital',   path: '/digital' },
  { label: 'Hourglass', path: '/hourglass' },
  { label: '95',        path: '/win95' },
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

function ServerTab() {
  const { serverUrl, setServerUrl, serverHeaders, setServerHeaders, isConnected } = useServerContext()

  const [urlDraft, setUrlDraft] = useState(serverUrl)

  const applyUrl = () => setServerUrl(urlDraft.trim())

  const updateHeader = (i, field, value) =>
    setServerHeaders(serverHeaders.map((h, idx) => idx === i ? { ...h, [field]: value } : h))

  const addHeader = () => setServerHeaders([...serverHeaders, { key: '', value: '' }])

  const removeHeader = (i) => setServerHeaders(serverHeaders.filter((_, idx) => idx !== i))

  return (
    <div className="tab-content">
      <div className="navMenuRow">
        <strong>Server URL</strong>
        <div className="setting-control" style={{ flex: 1, gap: '6px' }}>
          <Input
            className="settings-input"
            placeholder="https://example.com"
            value={urlDraft}
            onChange={e => setUrlDraft(e.target.value)}
            onBlur={applyUrl}
            onKeyDown={e => e.key === 'Enter' && applyUrl()}
            style={{ flex: 1 }}
          />
          <span
            style={{
              display: 'inline-block',
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: isConnected ? '#4caf50' : '#888',
              flexShrink: 0,
            }}
            title={isConnected ? 'Connected' : 'Not connected'}
          />
        </div>
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Headers</strong>
        {serverHeaders.map((h, i) => (
          <div key={i} className="navMenuRow" style={{ marginTop: '6px' }}>
            <Input
              className="settings-input"
              placeholder="Key"
              value={h.key}
              onChange={e => updateHeader(i, 'key', e.target.value)}
            />
            <Input
              className="settings-input"
              placeholder="Value"
              value={h.value}
              onChange={e => updateHeader(i, 'value', e.target.value)}
            />
            <button className="settings-btn-icon" onClick={() => removeHeader(i)}>✕</button>
          </div>
        ))}
        <div className="tab-actions">
          <Button className="settings-btn" onClick={addHeader}>+ Header</Button>
        </div>
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

  const { containerRef, timers, stopwatches } = useAppContext()
  const { isConnected } = useServerContext()
  const hourglassDisabled = timers.length > 1 || stopwatches.length > 0
  const navigate = useNavigate()
  const location = useLocation()

  const CLOCK_TYPES = [
    ...BASE_CLOCK_TYPES,
    ...(isConnected ? [{ label: 'Client', path: '/client' }, { label: 'Manager', path: '/manager' }] : []),
  ]

  const [defaultRoute, setDefaultRoute] = useState(loadDefaultRoute)
  const [mainTab, setMainTab] = useState('display')
  const [subTab, setSubTab]   = useState('settings')

  const switchMain = (id) => {
    setMainTab(id)
    if (id === 'display') setSubTab('settings')
  }

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

  const displaySubTabs = [
    { id: 'settings',   label: 'Settings' },
    ...(onAddTimer      ? [{ id: 'timers',      label: 'Timers'      }] : []),
    ...(onAddStopwatch  ? [{ id: 'stopwatches', label: 'Stopwatches' }] : []),
  ]

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal container={containerRef.current}>
        <Dialog.Backdrop className="settings-backdrop" />
        <Dialog.Popup className="settings-popup">

          <Dialog.Close className="settings-close">&times;</Dialog.Close>

          {/* Main tabs */}
          <div className="main-tabs">
            {['display', 'server'].map(id => (
              <button
                key={id}
                className={`main-tab${mainTab === id ? ' active' : ''}`}
                onClick={() => switchMain(id)}
              >
                {id === 'display' ? 'Display' : 'Server'}
              </button>
            ))}
          </div>

          {mainTab === 'display' && <>
            <RadioGroup value={defaultRoute} onValueChange={handleDefaultChange} className="clock-type-nav">
              {CLOCK_TYPES.map(({ label, path }) => {
                const disabled = path === '/hourglass' && hourglassDisabled
                return (
                  <div key={path} className="clock-type-item">
                    <button
                      className={`clock-type-btn${location.pathname === path ? ' active' : ''}${disabled ? ' disabled' : ''}`}
                      onClick={() => {
                        if (!disabled) {
                          handleNavigate(path)
                          handleDefaultChange(path)
                        }
                      }}
                      disabled={disabled}
                      title={disabled ? 'Remove extra timers and all stopwatches to use Hourglass' : undefined}
                    >
                      {label}
                    </button>
                  </div>
                )
              })}
            </RadioGroup>

            {/* Subtabs */}
            <div className="dialog-tabs">
              {displaySubTabs.map(t => (
                <button
                  key={t.id}
                  className={`dialog-tab${subTab === t.id ? ' active' : ''}`}
                  onClick={() => setSubTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {subTab === 'settings' && (
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

            {subTab === 'timers'      && <TimersTab onAddTimer={onAddTimer} />}
            {subTab === 'stopwatches' && <StopwatchesTab onAddStopwatch={onAddStopwatch} />}
          </>}

          {mainTab === 'server' && <ServerTab />}

        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
