import { Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import ClockBoard from './pages/ClockBoard'
import Airport from './pages/Airport'
import Hourglass from './pages/Hourglass'
import Nav from './components/Nav'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import { AppProvider, useAppContext } from './context/AppContext'
import { ServerProvider } from './context/ServerContext'
import React from 'react'
import Digital from './pages/Digital'
import Win95 from './pages/Win95'
import Client from './pages/Client'
import Manager from './pages/Manager'
import { Dialog } from '@base-ui/react/dialog'

// ── Time drift helpers ───────────────────────────────────────

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

function loadDriftCheck() {
  try {
    const val = localStorage.getItem('cb_lastDriftCheck')
    return val ? JSON.parse(val) : null
  } catch { return null }
}

function saveDriftCheck(data) {
  localStorage.setItem('cb_lastDriftCheck', JSON.stringify({ ...data, timestamp: Date.now() }))
}

async function getTimeDriftWithLatency() {
  const browserTime = Date.now()
  const requestStart = performance.now()
  const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC')
  const requestEnd = performance.now()

  const data = await response.json()

  const roundTripLatency    = requestEnd - requestStart
  const estimatedLatency    = roundTripLatency / 2
  const serverTime          = new Date(data.datetime).getTime()
  const adjustedServerTime  = serverTime - estimatedLatency
  const driftMs             = browserTime - adjustedServerTime

  return {
    browserTime,
    serverTime,
    adjustedServerTime,
    networkLatencyMs:   estimatedLatency.toFixed(2),
    roundTripLatencyMs: roundTripLatency.toFixed(2),
    driftMs,
    driftSeconds:  (driftMs / 1000).toFixed(2),
    driftMinutes:  (driftMs / 1000 / 60).toFixed(2),
    isSlow:    driftMs < 0,
    isAhead:   driftMs > 0,
    isAccurate: Math.abs(driftMs) < 650,
  }
}

// ── App shell ────────────────────────────────────────────────

function AppShell() {
  const {
    navOpen, setNavOpen,
    isFullscreen, makeFullscreen, closeFullscreen,
    showControls,
    addTimer, addStopwatch,
    containerRef,
  } = useAppContext()
  const { themeValues } = useSettings()

  const [driftWarning, setDriftWarning] = useState(null) // { driftSeconds, driftMs }

  React.useEffect(() => {
    const last = loadDriftCheck()
    if (last && Date.now() - last.timestamp < SEVEN_DAYS_MS) return

    let cancelled = false
    const timeout = setTimeout(async () => {
      try {
        const drift = await getTimeDriftWithLatency()
        if (cancelled) return
        console.log(`Network latency: ${drift.networkLatencyMs}ms`)
        console.log(`Adjusted drift: ${drift.driftSeconds}s`)
        console.log(`Clock is ${drift.isSlow ? 'slow' : 'ahead'} — accurate: ${drift.isAccurate}`)
        if (drift.isAccurate) {
          saveDriftCheck({ driftMs: drift.driftMs, isAccurate: true })
        } else {
          setDriftWarning({ driftSeconds: drift.driftSeconds, driftMs: drift.driftMs })
        }
      } catch {
        // retry once
        try {
          const drift = await getTimeDriftWithLatency()
          if (cancelled) return
          if (drift.isAccurate) {
            saveDriftCheck({ driftMs: drift.driftMs, isAccurate: true })
          } else {
            setDriftWarning({ driftSeconds: drift.driftSeconds, driftMs: drift.driftMs })
          }
        } catch (err) {
          console.error('Error fetching time drift:', err)
        }
      }
    }, 600)

    return () => { cancelled = true; clearTimeout(timeout) }
  }, [])

  const handleIgnoreDrift = () => {
    saveDriftCheck({ driftMs: driftWarning?.driftMs, isAccurate: false, ignored: true })
    setDriftWarning(null)
  }

  const driftAbs     = Math.abs(Number(driftWarning?.driftSeconds)).toFixed(1)
  const driftDir     = driftWarning?.driftMs > 0 ? 'ahead' : 'behind'

  return (
    <div id="app" ref={containerRef} style={{ '--primaryColor': themeValues.primaryColor, '--secondaryColor': themeValues.secondaryColor }}>
      <audio id="timer-complete-sound">
        <source src="assets/media/timer.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="controls-container" style={showControls ? { pointerEvents: 'all', opacity: 1 } : { pointerEvents: 'none' }}>
        <i onClick={() => setNavOpen(true)} className="fas fa-cog mainActionIcon" />
        &nbsp;&nbsp;&nbsp;
        {(document.children[0].requestFullscreen || document.children[0].mozRequestFullscreen || document.children[0].webkitRequestFullscreen || document.children[0].msRequestFullscreen) && (
          !isFullscreen
            ? <i id="fullscreen-open"  onClick={makeFullscreen}  className="fas fa-expand   mainActionIcon" />
            : <i id="fullscreen-close" onClick={closeFullscreen} className="fas fa-compress actionIcon mainActionIcon" />
        )}
      </div>

      <Nav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        onAddTimer={addTimer}
        onAddStopwatch={addStopwatch}
      />

      <Routes>
        <Route path="/"           element={<Navigate to={localStorage.getItem('cb_defaultRoute') || '/flipboard'} replace />} />
        <Route path="/clock"      element={<ClockBoard />} />
        <Route path="/flipboard"  element={<Airport />} />
        <Route path="/hourglass"  element={<Hourglass />} />
        <Route path="/digital"    element={<Digital />} />
        <Route path="/win95"      element={<Win95 />} />
        <Route path="/client"     element={<Client />} />
        <Route path="/manager"    element={<Manager />} />
      </Routes>

      {/* Clock accuracy warning */}
      <Dialog.Root open={!!driftWarning} onOpenChange={(open) => { if (!open) handleIgnoreDrift() }}>
        <Dialog.Portal container={containerRef.current}>
          <Dialog.Backdrop className="settings-backdrop" />
          <Dialog.Popup className="settings-popup drift-warning-popup">
            <Dialog.Title className="drift-warning-title">
              <i className="fas fa-exclamation-triangle" style={{ marginRight: 10 }} />
              Clock Accuracy Warning
            </Dialog.Title>
            <Dialog.Description className="drift-warning-body">
              Your system clock appears to be <strong>{driftAbs}s {driftDir}</strong> of the actual time.
              Timer and stopwatch accuracy may be affected.
            </Dialog.Description>
            <div className="drift-warning-actions">
              <button className="settings-btn settings-btn--primary" onClick={handleIgnoreDrift}>
                Ignore
              </button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <ServerProvider>
        <AppProvider>
          <AppShell />
        </AppProvider>
      </ServerProvider>
    </SettingsProvider>
  )
}
