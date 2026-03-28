import { Routes, Route, Navigate } from 'react-router-dom'
import ClockBoard from './pages/ClockBoard'
import Airport from './pages/Airport'
import Hourglass from './pages/Hourglass'
import Nav from './components/Nav'
import { SettingsProvider } from './context/SettingsContext'
import { AppProvider, useAppContext } from './context/AppContext'

function AppShell() {
  const {
    navOpen, setNavOpen,
    isFullscreen, makeFullscreen, closeFullscreen,
    showControls,
    addTimerHandler, addStopwatchHandler,
    containerRef,
  } = useAppContext()

  return (
    <div id="app" ref={containerRef}>
      <div
        id="mainNavIcon"
        className={`actionIcon${showControls ? ' show' : ''}`}
        style={{ position: 'absolute', top: '5%', left: '3%' }}
        onClick={() => setNavOpen(true)}
      >
        &#9776;
      </div>

      <Nav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        onAddTimer={addTimerHandler?.fn}
        onAddStopwatch={addStopwatchHandler?.fn}
      />

      {(document.children[0].requestFullscreen || document.children[0].mozRequestFullscreen || document.children[0].webkitRequestFullscreen || document.children[0].msRequestFullscreen )&& <div
        id="fullscreenButton"
        className={`fullscreen${showControls ? ' show' : ''}`}
        style={{ position: 'absolute', top: '5%', right: '3%' }}
      >
        {!isFullscreen && (
          <i id="fullscreen-open" onClick={makeFullscreen} className="fas fa-expand actionIcon"></i>
        )}
        {isFullscreen && (
          <i id="fullscreen-close" onClick={closeFullscreen} className="fas fa-compress actionIcon"></i>
        )}
      </div>}

      <Routes>
        <Route path="/" element={<Navigate to={localStorage.getItem('cb_defaultRoute') || '/clock'} replace />} />
        <Route path="/clock" element={<ClockBoard />} />
        <Route path="/flipboard" element={<Airport />} />
        <Route path="/hourglass" element={<Hourglass />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppProvider>
        <AppShell />
      </AppProvider>
    </SettingsProvider>
  )
}
