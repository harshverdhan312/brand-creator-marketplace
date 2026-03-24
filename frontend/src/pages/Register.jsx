import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register as registerApi } from '../services/authService'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'creator', bio: '', instagram: '', linkedin: '', website: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const { add } = useContext(NotificationContext)

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    // Client-side validation
    if (!form.name.trim() || !form.email.trim() || !form.password) {
      const msg = 'Please fill in all required fields'
      setError(msg)
      add && add(msg, 'error')
      return
    }
    if (form.password.length < 6) {
      const msg = 'Password must be at least 6 characters'
      setError(msg)
      add && add(msg, 'error')
      return
    }
    setSubmitting(true)
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
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed'
      setError(msg)
      add && add(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md card-dark p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="text-sm text-cyan-200/40 mt-1">Join the marketplace</p>
        </div>
        <form onSubmit={handle} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Name</label>
            <input className="input-dark" placeholder="Full name" value={form.name} onChange={e => { setError(''); setForm({ ...form, name: e.target.value }) }} />
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Email</label>
            <input className="input-dark" placeholder="you@example.com" type="email" value={form.email} onChange={e => { setError(''); setForm({ ...form, email: e.target.value }) }} />
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="input-dark pr-10" placeholder="••••••••" value={form.password} onChange={e => { setError(''); setForm({ ...form, password: e.target.value }) }} />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-200/45 hover:text-cyan-200/80 text-xs" onClick={() => setShowPassword(s => !s)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Role</label>
            <select value={form.role} onChange={e => { setError(''); setForm({ ...form, role: e.target.value }) }} className="input-dark cursor-pointer">
              <option value="creator">Creator</option>
              <option value="brand">Brand</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Bio</label>
            <textarea className="input-dark min-h-[60px]" placeholder="Tell us about yourself" value={form.bio} onChange={e => { setError(''); setForm({ ...form, bio: e.target.value }) }} />
          </div>
          <div className="divider my-2" />
          <div className="text-xs font-mono text-cyan-200/30 uppercase tracking-wider mb-2">Social Links (optional)</div>
          <div className="space-y-3">
            <input className="input-dark" placeholder="Instagram URL" value={form.instagram} onChange={e => { setError(''); setForm({ ...form, instagram: e.target.value }) }} />
            <input className="input-dark" placeholder="LinkedIn URL" value={form.linkedin} onChange={e => { setError(''); setForm({ ...form, linkedin: e.target.value }) }} />
            <input className="input-dark" placeholder="Website URL" value={form.website} onChange={e => { setError(''); setForm({ ...form, website: e.target.value }) }} />
          </div>
          <button disabled={submitting} className="w-full btn-action btn-success py-3 mt-2 font-semibold disabled:opacity-50">
            {submitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-cyan-200/40">
          Already have an account? <Link to="/login" className="text-neon-blue hover:text-neon-green transition-colors">Sign In</Link>
        </div>
      </div>
    </div>
  )
}
