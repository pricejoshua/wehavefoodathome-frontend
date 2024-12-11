import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import UserLanding from './pages/UserLanding'
import { supabase } from './utils/supabase'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/main" element={<UserLanding />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
