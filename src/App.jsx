import { Routes, Route } from 'react-router-dom'
import ClockBoard from './pages/ClockBoard'
import Airport from './pages/Airport'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ClockBoard />} />
      <Route path="/airport" element={<Airport />} />
    </Routes>
  )
}
