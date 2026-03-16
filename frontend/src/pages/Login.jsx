import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login as loginApi } from '../services/authService'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const { add } = useContext(NotificationContext)

  const handle = async (e) => {
    e.preventDefault()
    try {
      const res = await loginApi({ email, password })
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed'
      add && add(msg, 'error')
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md card-dark p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 mx-auto rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="text-sm text-cyan-200/40 mt-1">Sign in to your account</p>
        </div>
        <form onSubmit={handle} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Email</label>
            <input className="input-dark" placeholder="you@example.com" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Password</label>
            <input type="password" className="input-dark" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button className="w-full btn-action btn-primary py-3 mt-2 font-semibold">Sign In</button>
        </form>
        <div className="mt-6 text-center text-sm text-cyan-200/40">
          Don't have an account? <Link to="/register" className="text-neon-blue hover:text-neon-green transition-colors">Register</Link>
        </div>
      </div>
    </div>
  )
}
