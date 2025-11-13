import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'
import UserLanding from './pages/UserLanding'
import UploadReciept from './pages/UploadReciept'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CreateHouse from './pages/CreateHouse'
import HousePage from './pages/HousePage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <UserLanding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/house/add"
            element={
              <ProtectedRoute>
                <CreateHouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/house/:id"
            element={
              <ProtectedRoute>
                <HousePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadReciept />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
