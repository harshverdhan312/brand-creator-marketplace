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

  useEffect(() => {
    if (!otherUserId) return
    const load = async () => {
      try {
        const r = await getOrCreateWithUser(otherUserId)
        setConv(r.data)
      } catch (e) {
        setConv(null)
      }
    }
    load()
  }, [otherUserId])

  const handleSend = async () => {
    if (!text.trim() || !otherUserId) return
    try {
      const payload = { toUserId: otherUserId, text: text.trim(), conversationId: conv?._id }
      const r = await sendMessage(payload)
      // Re-fetch to get populated sender names
      const fresh = await getOrCreateWithUser(otherUserId)
      setConv(fresh.data)
      setText('')
    } catch (e) {
      // ignore
    }
  }

  if (!conv) return <div className="flex items-center justify-center p-8 text-cyan-200/40">Loading chat...</div>

  return (
    <div className="card-dark p-4">
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
        />
        <button onClick={handleSend} className="btn-action btn-primary px-5">Send</button>
      </div>
    </div>
  )
}
