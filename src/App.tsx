import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import UserLanding from './pages/UserLanding'
import UploadReciept from './pages/UploadReciept'
import { supabase } from './utils/supabase'

function App() {
  console.log("appppp")
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/main" element={<UserLanding />} />
        <Route path="/upload" element={<UploadReciept />} />

        <Route element={<div>Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
