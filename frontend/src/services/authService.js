import api, { fetchCsrfToken } from './api'

export const register = async (payload) => {
  await fetchCsrfToken()
  return api.post('/auth/register', payload)
}
export const login = async (payload) => {
  await fetchCsrfToken()
  return api.post('/auth/login', payload)
}
export const me = () => api.get('/auth/me')
export const refresh = () => api.post('/auth/refresh')
export const logout = () => api.post('/auth/logout')
