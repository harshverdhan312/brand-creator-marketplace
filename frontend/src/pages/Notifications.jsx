import React, { useEffect, useState } from 'react'
import { getNotifications, markRead, markAllRead } from '../services/notificationService'

const typeLabels = {
  NEW_PITCH: 'New Pitch',
  PITCH_ACCEPTED: 'Pitch Accepted',
  PITCH_REJECTED: 'Pitch Rejected',
  WORK_SUBMITTED: 'Work Submitted',
  PAYMENT_RELEASED: 'Payment Released',
  DISPUTE_OPENED: 'Dispute Opened',
  DISPUTE_RESOLVED: 'Dispute Resolved',
  NEW_MESSAGE: 'New Message',
}

const typeBadge = {
  NEW_PITCH: 'badge-cyan',
  PITCH_ACCEPTED: 'badge-green',
  PITCH_REJECTED: 'badge-red',
  WORK_SUBMITTED: 'badge-amber',
  PAYMENT_RELEASED: 'badge-green',
  DISPUTE_OPENED: 'badge-pink',
  DISPUTE_RESOLVED: 'badge-cyan',
  NEW_MESSAGE: 'badge-cyan',
}

export default function Notifications() {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      const r = await getNotifications()
      setNotes(r.data)
    } catch (e) {
      setNotes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id) => {
    try {
      await markRead(id)
      setNotes(n => n.map(x => x._id === id ? { ...x, read: true } : x))
    } catch (e) {}
  }

  const handleMarkAll = async () => {
    try {
      await markAllRead()
      setNotes(n => n.map(x => ({ ...x, read: true })))
    } catch (e) {}
  }

  if (loading) return <div className="flex items-center justify-center p-12 text-cyan-200/40">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 rounded-full bg-neon-blue" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
          <span className="badge badge-cyan">{notes.filter(n => !n.read).length} unread</span>
        </div>
        {notes.some(n => !n.read) && (
          <button onClick={handleMarkAll} className="btn-action btn-ghost text-xs">Mark All Read</button>
        )}
      </div>
      <div className="space-y-2">
        {notes.map(n => (
          <div
            key={n._id}
            className={`card-dark p-4 flex items-start gap-3 cursor-pointer transition-all ${n.read ? 'opacity-60' : ''}`}
            onClick={() => !n.read && handleMarkRead(n._id)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge ${typeBadge[n.type] || 'badge-cyan'}`}>
                  {typeLabels[n.type] || n.type}
                </span>
                {!n.read && <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />}
              </div>
              {n.payload?.message && (
                <div className="text-sm text-cyan-200/60 mt-1">{n.payload.message}</div>
              )}
              <div className="text-xs text-cyan-200/40 font-mono mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-cyan-200/40 py-12">No notifications yet.</div>
        )}
      </div>
    </div>
  )
}
