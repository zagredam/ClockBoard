import { createContext, useContext, useState, useEffect } from 'react'
import { TEAMS } from '../data/teams'


const defaults = {
  theme: 'MZ',
  altTheme: true,
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
  const [customThemes, setCustomThemesRaw] = useState(() => load('customThemes') ?? [])
  const [showSeconds, setShowSecondsRaw] = useState(() => load('showSeconds'))
  const [showMeridum, setShowMeridumRaw] = useState(() => load('showMeridum'))
  const [showDate, setShowDateRaw] = useState(() => load('showDate'))
  const [hourglassInterval, setHourglassIntervalRaw] = useState(() => load('hourglassInterval'))
  const themeOptions = [...TEAMS,...customThemes];
  let themeValues = {...(themeOptions.find(t => t.id === theme) )};
  if(altTheme){
    //swap primaryColor and secondaryColor properties of themeValues
    const tempColor = themeValues.primaryColor;
    themeValues.primaryColor = themeValues.secondaryColor;
    themeValues.secondaryColor = tempColor;
  }
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
  const setCustomThemes = (v) => { setCustomThemesRaw(v); save('customThemes', v) }
  const toggleAltTheme = () =>
    setAltThemeRaw((prev) => { save('altTheme', !prev); return !prev })

  // const cycleTheme = (dir) =>
  //   setThemeRaw((current) => {
  //     const idx = TEAMS.findIndex(t => t.id === current)
  //     const next =
  //       dir === 'prev'
  //         ? TEAMS[idx <= 0 ? TEAMS.length - 1 : idx - 1].id
  //         : TEAMS[idx >= TEAMS.length - 1 ? 0 : idx + 1].id
  //     save('theme', next)
  //     return next
  //   })

  return (
    <SettingsContext.Provider
      value={{
        theme, setTheme,
        altTheme, setAltTheme, toggleAltTheme,
        showSeconds, setShowSeconds,
        showMeridum, setShowMeridum,
        showDate, setShowDate,
        hourglassInterval, setHourglassInterval,
        themeOptions, themeValues,
        customThemes, setCustomThemes
        
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
