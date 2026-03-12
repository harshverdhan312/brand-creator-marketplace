import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
        : 'text-cyan-200/70 hover:text-neon-green hover:bg-neon-green/5'
    }`

  return (
    <nav className="sticky top-0 bg-bg-dark/80 shadow-neon">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center group-hover:shadow-neon-glow transition-all duration-300">
            <span className="text-neon-blue font-mono font-bold text-sm">BC</span>
          </div>
          <span className="font-bold text-lg text-neon-blue neon-title tracking-tight">BrandCreator</span>
        </Link>
        <div className="flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/messages" className={linkClass('/messages')}>Messages</Link>
              <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
              {user.role === 'creator' && <Link to="/my-brands" className={linkClass('/my-brands')}>My Brands</Link>}
              {user.role === 'brand' && <Link to="/working-creators" className={linkClass('/working-creators')}>Creators</Link>}
              <button onClick={logout} className="ml-2 px-3 py-1.5 rounded-md text-sm font-medium text-pink-400/80 hover:text-pink-300 hover:bg-pink-500/10 transition-all duration-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={linkClass('/login')}>Login</Link>
              <Link to="/register" className="ml-2 btn-neon primary text-sm !px-4 !py-2">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
