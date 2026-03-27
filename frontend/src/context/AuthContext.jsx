import React, { createContext, useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { me as meApi, logout as logoutApi } from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const loggingOut = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`
    }
    const loadMe = async () => {
      try {
        const res = await meApi()
        setUser(res.data.user)
      } catch (err) {
        setUser(null)
        localStorage.removeItem('token')
        delete api.defaults.headers.common.Authorization
      } finally {
        setLoading(false)
      }
    }
    if (token) loadMe()
    else setLoading(false)
  }, [])

  const login = useCallback((token, userData) => {
    localStorage.setItem('token', token)
    api.defaults.headers.common.Authorization = `Bearer ${token}`
    loggingOut.current = false
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    if (loggingOut.current) return
    loggingOut.current = true
    try { await logoutApi() } catch (e) { /* ignore */ }
    localStorage.removeItem('token')
    delete api.defaults.headers.common.Authorization
    window.dispatchEvent(new Event('auth:logout'))
    setUser(null)
    navigate('/login')
  }, [navigate])

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}
