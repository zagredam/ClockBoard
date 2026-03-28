import { createContext, useContext, useState, useEffect } from 'react'

export const NFL_TEAMS = [
  'None', 'MZ', 'ARZ', 'ATL', 'BLT', 'BUF', 'CAR', 'CHI', 'CIN', 'CLV',
  'DAL', 'DEN', 'DET', 'GB', 'HST', 'IND', 'JAX', 'KC', 'LAC', 'LA',
  'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'LV', 'PHI', 'PIT', 'SF',
  'SEA', 'TB', 'TEN', 'WAS',
]

const defaults = {
  theme: 'None',
  altTheme: false,
  showSeconds: true,
  showMeridum: true,
  showDate: true,
  hourglassInterval: 3600
}


const SettingsContext = createContext(null)

function load(key) {
  try {
    const val = localStorage.getItem(`cb_${key}`)
    return val !== null ? JSON.parse(val) : defaults[key]
  } catch {
    return defaults[key]
  }
}

function save(key, value) {
  localStorage.setItem(`cb_${key}`, JSON.stringify(value))
}

export function SettingsProvider({ children }) {
  const [theme, setThemeRaw] = useState(() => load('theme'))
  const [altTheme, setAltThemeRaw] = useState(() => load('altTheme'))
  const [showSeconds, setShowSecondsRaw] = useState(() => load('showSeconds'))
  const [showMeridum, setShowMeridumRaw] = useState(() => load('showMeridum'))
  const [showDate, setShowDateRaw] = useState(() => load('showDate'))
  const [hourglassInterval, setHourglassIntervalRaw] = useState(() => load('hourglassInterval'))

  useEffect(() => {
    const classes = [theme !== 'None' ? theme : '', altTheme ? 'alt' : ''].filter(Boolean)
    document.body.className = classes.join(' ')
  }, [theme, altTheme])

  const setTheme = (v) => { setThemeRaw(v); save('theme', v) }
  const setAltTheme = (v) => { setAltThemeRaw(v); save('altTheme', v) }
  const setShowSeconds = (v) => { setShowSecondsRaw(v); save('showSeconds', v) }
  const setShowMeridum = (v) => { setShowMeridumRaw(v); save('showMeridum', v) }
  const setShowDate = (v) => { setShowDateRaw(v); save('showDate', v) }
  const setHourglassInterval = (v) => { setHourglassIntervalRaw(v); save('hourglassInterval', v) }
  const toggleAltTheme = () =>
    setAltThemeRaw((prev) => { save('altTheme', !prev); return !prev })

  const cycleTheme = (dir) =>
    setThemeRaw((current) => {
      const idx = NFL_TEAMS.indexOf(current)
      const next =
        dir === 'prev'
          ? NFL_TEAMS[idx <= 0 ? NFL_TEAMS.length - 1 : idx - 1]
          : NFL_TEAMS[idx >= NFL_TEAMS.length - 1 ? 0 : idx + 1]
      save('theme', next)
      return next
    })

  return (
    <SettingsContext.Provider
      value={{
        theme, setTheme,
        altTheme, setAltTheme, toggleAltTheme,
        showSeconds, setShowSeconds,
        showMeridum, setShowMeridum,
        showDate, setShowDate,
        hourglassInterval, setHourglassInterval,
        cycleTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
