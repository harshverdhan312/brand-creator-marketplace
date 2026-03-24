import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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

  const handleMarkAll = async () => {
    try {
      await markAllRead()
      setNotes(n => n.map(x => ({ ...x, read: true })))
    } catch (e) {}
  }

  const fallbackLinkByType = (note) => {
    if (note.type === 'NEW_MESSAGE' && note.payload?.from) return `/messages?userId=${note.payload.from}`
    if ((note.type === 'NEW_PITCH' || note.type === 'PITCH_ACCEPTED') && note.payload?.pitchId) return `/pitches/${note.payload.pitchId}`
    if (note.type === 'PITCH_REJECTED') return '/pitches'
    if (note.type === 'WORK_SUBMITTED') {
      if (note.payload?.submissionId || note.payload?.pitchId) {
        return `/dashboard?submissionId=${note.payload?.submissionId || ''}&pitchId=${note.payload?.pitchId || ''}`
      }
      return '/dashboard'
    }
    return '/dashboard'
  }

  const handleOpenNotification = async (note) => {
    if (!note.read) {
      try {
        await markRead(note._id)
      } catch (e) {}
      setNotes(n => n.map(x => x._id === note._id ? { ...x, read: true } : x))
    }
    navigate(note.link || note.payload?.link || fallbackLinkByType(note))
  }

  if (loading) return <div className="flex items-center justify-center p-12 text-cyan-200/40">Loading...</div>

  return (
    <div className="max-w-2xl mx-auto px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-1.5 h-8 rounded-full bg-neon-blue" />
          <h2 className="text-2xl font-bold text-white tracking-tight">Notifications</h2>
          <span className="badge badge-cyan">{notes.filter(n => !n.read).length} unread</span>
        </div>
        {notes.some(n => !n.read) && (
          <button onClick={handleMarkAll} className="btn-action btn-ghost text-xs">Mark All Read</button>
        )}
      </div>
      <div className="flex flex-col gap-2 max-h-[70vh] overflow-y-auto pr-1 sm:pr-0 pb-2">
        {notes.map(n => (
          <button
            key={n._id}
            type="button"
            className={`card-dark p-4 flex items-start gap-3 text-left w-full transition-all ${n.read ? 'opacity-60' : ''}`}
            onClick={() => handleOpenNotification(n)}
          >
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
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
          </button>
        ))}
        {notes.length === 0 && (
          <div className="text-center text-cyan-200/40 py-12">No notifications yet.</div>
        )}
      </div>
    </div>
  )
}
