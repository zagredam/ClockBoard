# ClockBoard — Claude Code Guide

## Project Overview

ClockBoard is a React + Vite web application that displays a clock in multiple visual styles with integrated timer and stopwatch functionality. It uses React Context for state management and localStorage for persistence.

## Dev Commands

```bash
npm run dev       # Start dev server (Vite, typically http://localhost:5173)
npm run build     # Production build to dist/
npm run preview   # Preview production build
```

## Architecture

```
src/
  components/     # Reusable UI primitives (Clock, Nav, FlipDigit, Timer, Stopwatch, etc.)
  pages/          # Full-page clock views (ClockBoard, Airport, Digital, Hourglass, Win95)
  context/        # React Context providers (AppContext, SettingsContext, ServerContext)
  data/teams.js   # NFL team color themes (32 teams + custom)
  styles/         # Page-specific CSS files
  App.jsx         # Root component with React Router routes
  main.jsx        # Entry point
assets/
  styles/styles.css   # Global CSS + CSS variables for theming
  media/fonts/        # Custom fonts (Endzone Sans, Ubuntu Mono, Droid Sans Mono)
  media/timer.mp3     # Timer completion sound
```

### Routing (App.jsx)
Each clock mode is a route:
- `/` → `ClockBoard` (simple digital)
- `/airport` → flip-board animation
- `/digital` → seven-segment LED
- `/hourglass` → animated sand
- `/win95` → Windows 95 retro desktop

### State Management
- **AppContext** — timers, stopwatches, UI state (fullscreen, controls visibility)
- **SettingsContext** — theme, display options (seconds, AM/PM, date)
- **ServerContext** — optional backend sync URL and headers

All persisted keys in localStorage are prefixed with `cb_`.

### Theming
Themes are CSS variables set on `:root`. The `teams.js` file maps each NFL team to `primary` and `secondary` colors. Custom themes let users pick their own colors. The `altTheme` flag swaps primary/secondary.

## Key Patterns

- Components receive no direct props for global state — they consume Context via `useContext`.
- `GamepadService.js` is a singleton that dispatches gamepad events into the app.
- `ServerContext` pings `worldtimeapi.org` to calculate clock drift and correct displayed time.
- The Win95 page manages draggable windows with a shared `zTop` counter for z-index layering.

## Conventions

- `.jsx` extension for all React components.
- CSS files are co-located in `src/styles/` for pages and `assets/styles/` for globals.
- No TypeScript — plain JavaScript throughout.
- No CSS-in-JS — all styles in `.css` files with CSS custom properties for theming.
- Icons via FontAwesome 5 (`@fortawesome/fontawesome-free`).
- Accessible UI primitives via `@base-ui-components/react` (Dialog, Switch, RadioGroup, etc.).

## Adding a New Clock Mode

1. Create `src/pages/NewMode.jsx` and optionally `src/styles/newmode.css`.
2. Add a route in `src/App.jsx`.
3. Add a nav entry in `src/components/Nav.jsx`.
4. Store the route key in the `cb_defaultRoute` localStorage value if it should be user-selectable as the default.
