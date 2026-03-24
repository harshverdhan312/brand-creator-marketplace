import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5136/api',
})
// send cookies for refresh token flows
api.defaults.withCredentials = true

function getCookie(name) {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

api.interceptors.request.use((config) => {
  const method = (config.method || 'get').toUpperCase()
  const hasBearer = Boolean(config.headers?.Authorization || api.defaults.headers.common?.Authorization)
  if (!hasBearer && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const csrfToken = getCookie('csrfToken')
    if (csrfToken) {
      config.headers = config.headers || {}
      config.headers['x-csrf-token'] = csrfToken
    }
  }
  return config
})

export default api
