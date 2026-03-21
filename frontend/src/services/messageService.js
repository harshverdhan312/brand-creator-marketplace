import api from './api'

export const sendMessage = (payload) => api.post('/messages/send', payload)
export const getConversation = (conversationId) => api.get(`/messages/${conversationId}`)
export const getOrCreateWithUser = (userId) => api.get(`/messages/with/${userId}`)
export const listConversations = () => api.get('/messages')
