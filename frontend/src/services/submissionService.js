import api from './api'

export const createSubmission = (payload) => api.post('/submissions', payload)
export const getSubmissionsForCreator = () => api.get('/submissions/creator')
export const getSubmissionsForBrand = () => api.get('/submissions/brand')
export const acceptSubmission = (id) => api.post(`/submissions/${id}/accept`)
export const rejectSubmission = (id, payload) => api.post(`/submissions/${id}/reject`, payload)
