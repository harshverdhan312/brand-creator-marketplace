import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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
      add && add('Login failed', 'error')
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>
      <form onSubmit={handle} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" className="w-full p-2 border rounded" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-gray-800 text-white py-2 rounded">Login</button>
      </form>
    </div>
  )
}
