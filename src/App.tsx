// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Homepage } from './components/Homepage'
import { Daily } from './components/Daily'
import { Page } from './components/Page'
import { Practice } from './components/Practice'

function App() {
//   const [count, setCount] = useState(0)

  return (
    <BrowserRouter basename="/hancheck">
      <Routes>
        <Route path="/" element={<Page />}>
          <Route index element={<Homepage />} />
          <Route path="/daily" element={<Daily />} />
          <Route path="/practice/:difficulty" element={<Practice />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
