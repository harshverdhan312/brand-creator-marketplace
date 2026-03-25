import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5136/api',
  withCredentials: true,
})

let csrfToken = null
let csrfTokenPromise = null

export async function fetchCsrfToken() {
  if (csrfToken) return csrfToken
  if (csrfTokenPromise) return csrfTokenPromise
  csrfTokenPromise = api.get('/csrf-token').then((res) => {
    csrfToken = res?.data?.csrfToken || null
    return csrfToken
  }).catch(() => {
    csrfToken = null
    return null
  }).finally(() => {
    csrfTokenPromise = null
  })
  return csrfTokenPromise
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || 'get').toUpperCase()
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const token = csrfToken || await fetchCsrfToken()
    if (token) {
      config.headers = config.headers || {}
      config.headers['x-csrf-token'] = token
    }
  }
  return config
})

export default api
