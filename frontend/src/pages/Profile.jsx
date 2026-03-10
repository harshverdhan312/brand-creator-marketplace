import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getUser, getMe, updateMe } from '../services/userService'
import ChatBox from '../components/ChatBox'
import { NotificationContext } from '../context/NotificationContext'

export default function Profile() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const { add } = useContext(NotificationContext)
  const [profile, setProfile] = useState(null)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', bio: '', instagram: '', linkedin: '', website: '' })

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

  if (!profile) return <div>Loading...</div>

  const isOwn = !id || (user && user._id === profile._id)

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <div className="text-sm text-gray-600">{profile.role}</div>
        </div>
        {isOwn && (
          <div>
            <button onClick={() => setEditing(!editing)} className="px-3 py-1 border rounded">{editing ? 'Cancel' : 'Edit'}</button>
          </div>
        )}
      </div>

      {!editing && (
        <div className="mt-4">
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <div className="font-medium">Account</div>
            <div className="text-sm text-gray-700">Balance: {profile.balance || 0} INR</div>
          </div>
          <p className="text-gray-700">{profile.bio}</p>
          <div className="mt-3">
            {profile.socialLinks?.instagram && <div><a className="text-blue-600" href={profile.socialLinks.instagram} target="_blank" rel="noreferrer">Instagram</a></div>}
            {profile.socialLinks?.linkedin && <div><a className="text-blue-600" href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></div>}
            {profile.socialLinks?.website && <div><a className="text-blue-600" href={profile.socialLinks.website} target="_blank" rel="noreferrer">Website</a></div>}
          </div>
        </div>
      )}

      {editing && (
        <div className="mt-4 space-y-3">
          <input className="w-full p-2 border rounded" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
          <textarea className="w-full p-2 border rounded" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="Short bio" />
          <input className="w-full p-2 border rounded" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} placeholder="Instagram URL" />
          <input className="w-full p-2 border rounded" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} placeholder="LinkedIn URL" />
          <input className="w-full p-2 border rounded" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="Website URL" />
          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(false)} className="px-3 py-1 border rounded">Cancel</button>
            <button onClick={handleSave} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
          </div>
        </div>
      )}

      
    </div>
  )
}
