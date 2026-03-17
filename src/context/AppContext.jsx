import { createContext, useContext, useState, useEffect, useRef } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [navOpen, setNavOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(false)
  const [addTimerHandler, setAddTimerHandler] = useState(null)     // { fn } | null
  const [addStopwatchHandler, setAddStopwatchHandler] = useState(null)

  const containerRef = useRef(null)
  const hideTimeoutRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = setTimeout(() => setShowControls(false), 2000)
    }
    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    }
  }, [])

  const makeFullscreen = () => {
    const elem = containerRef.current
    if (elem.requestFullscreen) elem.requestFullscreen()
    else if (elem.mozRequestFullScreen) elem.mozRequestFullScreen()
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen()
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen()
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.msExitFullscreen) document.msExitFullscreen()
    setIsFullscreen(false)
  }

  return (
    <AppContext.Provider
      value={{
        navOpen, setNavOpen,
        isFullscreen, makeFullscreen, closeFullscreen,
        showControls,
        addTimerHandler, setAddTimerHandler,
        addStopwatchHandler, setAddStopwatchHandler,
        containerRef,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  return useContext(AppContext)
}
