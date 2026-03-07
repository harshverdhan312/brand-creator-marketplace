import api from './api'

export const listOpen = () => api.get('/campaigns/open')
export const createCampaign = (data) => api.post('/campaigns', data)
export const getCampaign = (id) => api.get(`/campaigns/${id}`)
export const getBrandCampaigns = () => api.get('/campaigns/brand')
export const createCampaignForBrand = (data) => api.post('/campaigns/for-brand', data)
export const getPendingForBrand = () => api.get('/campaigns/pending')
export const approveCampaign = (id) => api.post(`/campaigns/${id}/approve`)
export const rejectCampaign = (id) => api.post(`/campaigns/${id}/reject`)
// getCampaign already exported above
