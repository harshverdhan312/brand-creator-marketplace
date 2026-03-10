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

  if (!conv) return <div>Loading chat...</div>

  return (
    <div className="border rounded p-3">
      <div className="h-48 overflow-auto mb-2">
        {conv.messages.map(m => (
          <div key={m._id || Math.random()} className="mb-1"><span className="font-medium">{m.sender?.name || 'User'}:</span> {m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e => setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Message" />
        <button onClick={handleSend} className="px-3 py-1 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  )
}
