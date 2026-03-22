import { Routes, Route } from 'react-router-dom'
import PortfolioPage from './components/Portfolio'
import HackathonCalendar from './components/HackathonCalendar'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
      <Route path="/cal" element={<HackathonCalendar />} />
    </Routes>
  )
}

export default App
