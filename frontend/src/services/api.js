import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5136/api',
})
// send cookies for refresh token flows
api.defaults.withCredentials = true

export default api
