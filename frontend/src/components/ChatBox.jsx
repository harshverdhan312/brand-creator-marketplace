import React, { useEffect, useState } from 'react'
import { getOrCreateWithUser, sendMessage } from '../services/messageService'

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function ChatBox({ otherUserId }) {
  const [conv, setConv] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [blocked, setBlocked] = useState(false)

  useEffect(() => {
    if (!otherUserId) return
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const r = await getOrCreateWithUser(otherUserId)
        setConv(r.data)
        setBlocked(false)
      } catch (e) {
        setConv(null)
        const msg = e?.response?.data?.message || 'Unable to load chat'
        setError(msg)
        setBlocked(e?.response?.status === 403)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [otherUserId])

  const handleSend = async () => {
    if (!text.trim() || !otherUserId) return
    if (blocked) return
    setError('')
    try {
      const payload = { toUserId: otherUserId, text: text.trim(), conversationId: conv?._id }
      await sendMessage(payload)
      // Re-fetch to get populated sender names
      const fresh = await getOrCreateWithUser(otherUserId)
      setConv(fresh.data)
      setText('')
    } catch (e) {
      const msg = e?.response?.data?.message || 'Failed to send message'
      setError(msg)
      setBlocked(e?.response?.status === 403)
    }
  }

  if (loading) return <div className="flex items-center justify-center p-8 text-cyan-200/40">Loading chat...</div>

  if (!conv) return (
    <div className="flex flex-col items-center justify-center p-8 text-cyan-200/40 gap-2">
      <div>{blocked ? 'You can only message after a pitch is accepted.' : (error || 'Select a valid connection to chat.')}</div>
    </div>
  )

  return (
    <div className="card-dark p-4">
      {error && (
        <div className="mb-3 text-xs text-red-300 border border-red-500/30 bg-red-500/10 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      {blocked && (
        <div className="mb-3 text-xs text-amber-200 border border-amber-500/30 bg-amber-500/10 rounded-md px-3 py-2">
          Messaging is locked until a pitch is accepted between both users.
        </div>
      )}
      <div className="h-56 overflow-auto mb-3 space-y-2 px-1">
        {conv.messages.map(m => (
          <div key={m._id || Math.random()} className="text-sm">
            <span className="font-medium text-neon-blue font-mono text-xs">{m.sender?.name || 'User'}</span>
            <span className="text-cyan-200/20 mx-1.5 text-xs">{formatTime(m.createdAt)}</span>
            <span className="text-cyan-200/30 mx-1">›</span>
            <span className="text-cyan-200/70">{m.text}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2 border-t border-border-dim pt-3">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="input-dark flex-1"
          placeholder="Type a message..."
          aria-label="Type a message"
          disabled={blocked}
        />
        <button onClick={handleSend} className="btn-action btn-primary px-5 disabled:opacity-50" disabled={blocked || !text.trim()}>Send</button>
      </div>
    </div>
  )
}
