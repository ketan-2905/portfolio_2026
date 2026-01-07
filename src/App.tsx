import { Routes, Route } from 'react-router-dom'
import PortfolioPage from './components/Portfolio'

function App() {
  return (
    <Routes>
      <Route path="/" element={<PortfolioPage />} />
    </Routes>
  )
}

export default App
