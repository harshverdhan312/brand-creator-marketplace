import api from './api'

export const getWorkingBrands = () => api.get('/escrow/working/brands')
export const getWorkingCreators = () => api.get('/escrow/working/creators')
export const getEscrowsForCreator = () => api.get('/escrow/creator')
