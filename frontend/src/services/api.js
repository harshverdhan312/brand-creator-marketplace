import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5136/api',
})

const initialToken = localStorage.getItem('token')
if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
