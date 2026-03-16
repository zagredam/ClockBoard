import { Routes, Route } from 'react-router-dom'
import ClockBoard from './pages/ClockBoard'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClockBoard />} />
    </Routes>
  )
}
