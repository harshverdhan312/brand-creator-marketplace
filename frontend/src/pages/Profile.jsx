import React, { useEffect, useState, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getUser, getMe, updateMe } from '../services/userService'
import { NotificationContext } from '../context/NotificationContext'
import { myPitches, getPitchesForBrand } from '../services/pitchService'

const acceptedStatuses = [
  'PITCH_ACCEPTED',
  'WORK_IN_PROGRESS',
  'WORK_SUBMITTED',
  'APPROVAL_PENDING',
  'APPROVED',
  'DISPUTED',
  'COMPLETED'
]

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const { add } = useContext(NotificationContext)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', instagram: '', linkedin: '', website: '' })
  const [canMessage, setCanMessage] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        if (id) {
          const r = await getUser(id)
          setProfile(r.data)
        } else {
          const r = await getMe()
          setProfile(r.data)
        }
      } catch (e) {}
    }
    load()
  }, [id])

  useEffect(() => {
    if (!profile) return
    setForm({
      name: profile.name || '',
      bio: profile.bio || '',
      instagram: profile.socialLinks?.instagram || '',
      linkedin: profile.socialLinks?.linkedin || '',
      website: profile.socialLinks?.website || ''
    })
  }, [profile])

  useEffect(() => {
    const checkConnection = async () => {
      if (!user || !id || user._id === id) {
        setCanMessage(false)
        return
      }
      try {
        if (user.role === 'brand') {
          const r = await getPitchesForBrand()
          setCanMessage((r.data || []).some(p => acceptedStatuses.includes(p.status) && String(p.creatorId?._id || p.creatorId) === String(id)))
        } else if (user.role === 'creator') {
          const r = await myPitches()
          setCanMessage((r.data || []).some(p => acceptedStatuses.includes(p.status) && String(p.brand?.id || p.brandId) === String(id)))
        } else {
          setCanMessage(false)
        }
      } catch (e) {
        setCanMessage(false)
      }
    }
    checkConnection()
  }, [user, id])

  const handleSave = async () => {
    try {
      const payload = { name: form.name, bio: form.bio, socialLinks: { instagram: form.instagram, linkedin: form.linkedin, website: form.website } }
      const r = await updateMe(payload)
      setProfile(r.data)
      setEditing(false)
      add('Profile updated', 'success')
    } catch (e) {
      add('Failed to update profile', 'error')
    }
  }

  if (!profile) return <div className="flex items-center justify-center p-12 text-cyan-200/40">Loading...</div>

  const isOwn = !id || (user && user._id === profile._id)
  const isBrandViewingCreator = !!id && !isOwn && user?.role === 'brand' && profile?.role === 'creator'

  return (
    <div className="max-w-2xl mx-auto card-dark p-8">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <span className="text-neon-blue font-mono text-xl font-bold">{profile.name?.charAt(0)?.toUpperCase()}</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
            <span className="badge badge-cyan mt-1">{profile.role}</span>
          </div>
        </div>
        {isOwn && (
          <button onClick={() => setEditing(!editing)} className={`btn-action ${editing ? 'btn-ghost' : 'btn-primary'} text-xs`}>
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        )}
      </div>

      {isBrandViewingCreator && (
        <div className="mt-6 p-4 rounded-lg bg-surface/50 border border-border-dim">
          <div className="text-xs font-mono text-cyan-200/40 uppercase tracking-wider mb-3">Collaboration</div>
          <div className="flex flex-wrap gap-2">
            {canMessage ? (
              <>
                <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-action btn-primary text-xs">Connect</button>
                <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-action btn-success text-xs">Message</button>
                <button onClick={() => navigate(`/messages?userId=${id}`)} className="btn-action btn-ghost text-xs">Hire / Invite</button>
              </>
            ) : (
              <button onClick={() => navigate('/')} className="btn-action btn-primary text-xs">Send Pitch to Connect</button>
            )}
          </div>
          {!canMessage && (
            <div className="text-xs text-cyan-200/40 mt-2">Messaging unlocks after a pitch is accepted.</div>
          )}
        </div>
      )}

      {!editing && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-lg bg-surface/50 border border-border-dim">
            <div className="text-xs font-mono text-cyan-200/40 uppercase tracking-wider mb-2">Account</div>
            <div className="text-sm text-cyan-200/60">Balance: <span className="text-neon-green font-mono font-semibold">₹{profile.balance || 0}</span></div>
          </div>
          <p className="text-cyan-200/60 leading-relaxed">{profile.bio}</p>
          <div className="space-y-2">
            {profile.socialLinks?.instagram && (
              <a className="flex items-center gap-2 text-neon-blue hover:text-neon-green transition-colors text-sm" href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">
                <span className="font-mono text-xs">→</span> Instagram
              </a>
            )}
            {profile.socialLinks?.linkedin && (
              <a className="flex items-center gap-2 text-neon-blue hover:text-neon-green transition-colors text-sm" href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">
                <span className="font-mono text-xs">→</span> LinkedIn
              </a>
            )}
            {profile.socialLinks?.website && (
              <a className="flex items-center gap-2 text-neon-blue hover:text-neon-green transition-colors text-sm" href={profile.socialLinks.website} target="_blank" rel="noreferrer">
                <span className="font-mono text-xs">→</span> Website
              </a>
            )}
          </div>
        </div>
      )}

      {editing && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Name</label>
            <input className="input-dark" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea className="input-dark min-h-[80px]" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short bio" />
          </div>
          <div className="divider my-2" />
          <div className="text-xs font-mono text-cyan-200/30 uppercase tracking-wider mb-2">Social Links</div>
          <input className="input-dark" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="Instagram URL" />
          <input className="input-dark" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL" />
          <input className="input-dark" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="Website URL" />
          <div className="flex justify-end gap-2 pt-2">
            <button onClick={() => setEditing(false)} className="btn-action btn-ghost">Cancel</button>
            <button onClick={handleSave} className="btn-action btn-success">Save Changes</button>
          </div>
        </div>
      )}

      
    </div>
  )
}
