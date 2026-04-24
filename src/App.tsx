import { Routes, Route } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import PortfolioPage from './components/Portfolio'
import HackathonCalendar from './components/HackathonCalendar'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PortfolioPage />} />
        <Route path="/cal" element={<HackathonCalendar />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default App
