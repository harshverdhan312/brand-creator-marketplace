import api from './api'

export const adminListUsers = () => api.get('/admin/users')
export const adminListDisputes = () => api.get('/disputes')
export const adminResolveDispute = (disputeId, resolution) => api.post(`/disputes/${disputeId}/resolve`, { resolution })
