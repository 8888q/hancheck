// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Homepage } from './components/Homepage'
import { Daily } from './components/Daily'

function App() {
//   const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Homepage />} />
        <Route path="/daily" element={<Daily />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
