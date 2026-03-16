import React, { createContext, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { refresh as refreshTokenApi, logout as logoutApi } from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // try to get fresh access token using refresh token cookie
    const tryRefresh = async () => {
      try {
        const res = await refreshTokenApi()
        const token = res.data.token
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(res.data.user)
      } catch (err) {
        setUser(null)
        delete api.defaults.headers.common['Authorization']
      } finally {
        setLoading(false)
      }
    }
    tryRefresh()
  }, [])

  const login = useCallback((token, userData) => {
    // server sets refresh cookie; store access token in memory/header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    try { await logoutApi() } catch (e) {}
    delete api.defaults.headers.common['Authorization']
    setUser(null)
    navigate('/login')
  }, [navigate])

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}
