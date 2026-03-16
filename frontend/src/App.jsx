import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PitchPage from './pages/PitchPage'
import Profile from './pages/Profile'
import MyBrands from './pages/MyBrands'
import WorkingCreators from './pages/WorkingCreators'
import Messages from './pages/Messages'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-bg-dark text-cyan-100 font-sans">
          <Navbar />
          <main className="container mx-auto px-4 py-6">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* Campaign routes removed */}
            <Route path="/my-brands" element={<ProtectedRoute><MyBrands /></ProtectedRoute>} />
            <Route path="/working-creators" element={<ProtectedRoute><WorkingCreators /></ProtectedRoute>} />
            <Route path="/pitches/:id" element={<ProtectedRoute><PitchPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}
