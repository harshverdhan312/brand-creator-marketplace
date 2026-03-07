import api from './api'

export const sendPitch = (payload) => api.post('/pitches', payload)
export const acceptPitch = (id) => api.post(`/pitches/${id}/accept`)
export const myPitches = () => api.get('/pitches/me')
export const listForCampaign = (campaignId) => api.get(`/pitches/campaign/${campaignId}`)
export const sendPitchToBrand = (payload) => api.post('/pitches/to-brand', payload)
export const getPitchesForBrand = () => api.get('/pitches/for-brand')
export const rejectPitch = (id) => api.post(`/pitches/${id}/reject`)
