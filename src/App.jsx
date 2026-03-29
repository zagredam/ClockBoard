import { Routes, Route, Navigate } from 'react-router-dom'
import ClockBoard from './pages/ClockBoard'
import Airport from './pages/Airport'
import Hourglass from './pages/Hourglass'
import Nav from './components/Nav'
import { SettingsProvider } from './context/SettingsContext'
import { AppProvider, useAppContext } from './context/AppContext'
import React from 'react'

function AppShell() {
  const {
    navOpen, setNavOpen,
    isFullscreen, makeFullscreen, closeFullscreen,
    showControls,
    addTimerHandler, addStopwatchHandler,
    containerRef,
  } = useAppContext()
  React.useEffect(() => {
    async function getTimeDriftWithLatency() {
      const browserTime = Date.now();
      
      try {
        // Measure round-trip time to server
        const requestStart = performance.now();
        const response = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const requestEnd = performance.now();
        
        const data = await response.json();
        
        // Calculate network latency (round-trip time / 2)
        const roundTripLatency = requestEnd - requestStart;
        const estimatedLatency = roundTripLatency / 2;
        
        // Parse server time from response
        const serverTime = new Date(data.datetime).getTime();
        
        // Adjust server time by adding estimated one-way latency
        // This accounts for the time it took to receive the response
        const adjustedServerTime = serverTime - estimatedLatency;
        
        // Calculate drift
        const driftMs = browserTime - adjustedServerTime;
        
        return {
          browserTime: browserTime,
          serverTime: serverTime,
          adjustedServerTime: adjustedServerTime,
          networkLatencyMs: estimatedLatency.toFixed(2),
          roundTripLatencyMs: roundTripLatency.toFixed(2),
          driftMs: driftMs,
          driftSeconds: (driftMs / 1000).toFixed(2),
          driftMinutes: (driftMs / 1000 / 60).toFixed(2),
          isSlow: driftMs < 0,
          isAhead: driftMs > 0,
          isAccurate: Math.abs(driftMs) < 500  // Within 500ms
        };
      } catch (error) {
        console.log('Error fetching server time: retrying');
        return null;
      }
    }
    setTimeout(() => {
    // Usage
    getTimeDriftWithLatency().then(drift => {
      if (drift) {
        console.log(`Network latency: ${drift.networkLatencyMs}ms`);
        console.log(`Adjusted drift: ${drift.driftSeconds} seconds`);
        console.log(`Clock is ${drift.isSlow ? 'slow' : 'ahead'}`);
        console.log(`Accurate: ${drift.isAccurate}`);
      }
    }).catch(err => {
      console.error('Error occurred while fetching time drift:', err);
      getTimeDriftWithLatency().then(drift => {
      if (drift) {
        console.log(`Network latency: ${drift.networkLatencyMs}ms`);
        console.log(`Adjusted drift: ${drift.driftSeconds} seconds`);
        console.log(`Clock is ${drift.isSlow ? 'slow' : 'ahead'}`);
        console.log(`Accurate: ${drift.isAccurate}`);
      }
    }).catch(err => {
      console.error('Error occurred while fetching time drift:', err);
    
    });},600);
    });
  }, []);
    
  return (
    <div id="app" ref={containerRef}>
      <div className="controls-container" style={showControls ? {pointerEvents:"all",opacity:1} : {pointerEvents:"none"}}>
        <i onClick={() => setNavOpen(true)} className="fas fa-cog  mainActionIcon"></i>
      
      &nbsp;&nbsp;&nbsp;
      {(document.children[0].requestFullscreen || document.children[0].mozRequestFullscreen || document.children[0].webkitRequestFullscreen || document.children[0].msRequestFullscreen ) &&
        (!isFullscreen ? 
          <i id="fullscreen-open" onClick={makeFullscreen} className="fas fa-expand  mainActionIcon"></i>
        :
          <i id="fullscreen-close" onClick={closeFullscreen} className="fas fa-compress actionIcon mainActionIcon"></i>
        )}
      </div>
      

      <Nav
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        onAddTimer={addTimerHandler?.fn}
        onAddStopwatch={addStopwatchHandler?.fn}
      />
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
