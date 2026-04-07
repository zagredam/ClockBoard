# ClockBoard

A full-screen clock web app with five visual styles, multi-timer support, and 32 NFL team color themes.

## Features

- **5 clock modes** — Simple, Airport (flip-board), Digital (seven-segment LED), Hourglass, Win95 retro
- **Timers & stopwatches** — create multiple at once with labels, presets (20s / 5m / 25m / 1h), and an audio completion alert
- **Theming** — 32 NFL team color palettes or fully custom colors, with a primary/secondary swap toggle
- **Display options** — toggle seconds, AM/PM, and date visibility
- **Fullscreen mode** — controls auto-hide after 2 seconds of inactivity
- **Gamepad support** — navigate and control with a game controller
- **Persistent state** — all settings and active timers survive page reloads via localStorage
- **Time sync** — optional drift correction via worldtimeapi.org

## Getting Started

**Requirements:** Node.js 18+

```bash
npm install
npm run dev       # Start dev server → http://localhost:5173
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Clock Modes

| Mode | Route | Description |
|---|---|---|
| Simple | `/` | Clean digital clock |
| Airport | `/airport` | Animated split-flap flip-board digits |
| Digital | `/digital` | Seven-segment LED display |
| Hourglass | `/hourglass` | Animated sand falling in real time |
| Win95 | `/win95` | Windows 95 retro desktop with draggable windows |

## Tech Stack

- [React 18](https://react.dev/) + [React Router 6](https://reactrouter.com/)
- [Vite 5](https://vitejs.dev/)
- React Context API + localStorage
- [Base UI](https://base-ui.com/) for accessible primitives
- Plain CSS with custom properties for theming

## Project Structure

```
src/
  components/    # Clock, Nav, FlipDigit, Timer, Stopwatch, TimersSection
  pages/         # ClockBoard, Airport, Digital, Hourglass, Win95
  context/       # AppContext, SettingsContext, ServerContext
  data/teams.js  # NFL team color definitions
assets/
  styles/        # Global CSS
  media/         # Fonts and timer sound
```

See [CLAUDE.md](CLAUDE.md) for development conventions and architecture notes.
