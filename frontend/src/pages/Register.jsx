import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { register as registerApi } from '../services/authService'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'creator', bio: '', instagram: '', linkedin: '', website: '' })
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const { add } = useContext(NotificationContext)

  const handle = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        bio: form.bio,
        socialLinks: { instagram: form.instagram, linkedin: form.linkedin, website: form.website }
      }
      const res = await registerApi(payload)
      // server returns user.id — normalize to _id for frontend
      const userObj = res.data.user || {}
      const user = { ...userObj, _id: userObj.id }
      login(res.data.token, user)
      navigate('/dashboard')
    } catch (err) {
      add && add('Registration failed', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      <form onSubmit={handle} className="space-y-3">
        <input className="w-full p-2 border rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full p-2 border rounded">
          <option value="creator">Creator</option>
          <option value="brand">Brand</option>
        </select>
        <textarea className="w-full p-2 border rounded" placeholder="Short bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Instagram URL" value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="LinkedIn URL" value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Website URL" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} />
        <button className="w-full bg-gray-800 text-white py-2 rounded">Register</button>
      </form>
    </div>
  )
}
