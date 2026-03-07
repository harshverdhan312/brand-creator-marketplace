import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import { refresh as refreshTokenApi, logout as logoutApi } from '../services/authService'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)

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
      }
    }
    tryRefresh()
  }, [])

  const login = (token, userData) => {
    // server sets refresh cookie; store access token in memory/header
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(userData)
  }

  const logout = async () => {
    try { await logoutApi() } catch (e) {}
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}
