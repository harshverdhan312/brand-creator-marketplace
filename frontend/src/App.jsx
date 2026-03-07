import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CampaignDetails from './pages/CampaignDetails'
import CreateCampaign from './pages/CreateCampaign'
import PitchPage from './pages/PitchPage'
import Profile from './pages/Profile'
import MyBrands from './pages/MyBrands'
import WorkingCreators from './pages/WorkingCreators'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto p-4">
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/campaigns/create" element={<CreateCampaign />} />
            <Route path="/campaigns/:id" element={<CampaignDetails />} />
            <Route path="/my-brands" element={<MyBrands />} />
            <Route path="/working-creators" element={<WorkingCreators />} />
            <Route path="/pitches/:id" element={<PitchPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:id" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </NotificationProvider>
    </AuthProvider>
  )
}
