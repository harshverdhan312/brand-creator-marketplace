import React, { useEffect, useState } from 'react'
import { getOrCreateWithUser, sendMessage, getConversation } from '../services/messageService'

export default function ChatBox({ otherUserId }) {
  const [conv, setConv] = useState(null)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!otherUserId) return
    const load = async () => {
      const r = await getOrCreateWithUser(otherUserId)
      setConv(r.data)
    }
    load()
  }, [otherUserId])

  const handleSend = async () => {
    if (!text || !otherUserId) return
    const payload = { toUserId: otherUserId, text, conversationId: conv?._id }
    const r = await sendMessage(payload)
    setConv(r.data)
    setText('')
  }

  if (!conv) return <div className="flex items-center justify-center p-8 text-cyan-200/40">Loading chat...</div>

  return (
    <div className="card-dark p-4">
      <div className="h-56 overflow-auto mb-3 space-y-2 px-1">
        {conv.messages.map(m => (
          <div key={m._id || Math.random()} className="text-sm">
            <span className="font-medium text-neon-blue font-mono text-xs">{m.sender?.name || 'User'}</span>
            <span className="text-cyan-200/30 mx-1.5">›</span>
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
