import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Trophy from './pages/Trophy'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/*' element={<Landing />} />
          <Route path='/trophy' element={<Trophy />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
