import api from './api'

export const getBrands = () => api.get('/users/brands')
export const getCreators = () => api.get('/users/creators')
export const getUser = (id) => api.get(`/users/${id}`)
export const getMe = () => api.get('/users/me/profile')
export const updateMe = (payload) => api.put('/users/me/profile', payload)
