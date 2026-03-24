import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getNotifications } from '../services/notificationService'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnread = async () => {
      if (!user) {
        setUnreadCount(0)
        return
      }
      try {
        const r = await getNotifications()
        const unread = (r.data || []).filter((n) => !n.read).length
        setUnreadCount(unread)
      } catch (e) {
        setUnreadCount(0)
      }
    }
    loadUnread()
  }, [user, location.pathname])

  const linkClass = (path) =>
    `px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
      location.pathname === path
        ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
        : 'text-cyan-200/70 hover:text-neon-green hover:bg-neon-green/5'
    }`

  const mobileLinkClass = (path) =>
    `block px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium transition-all duration-200 truncate ${
      location.pathname === path
        ? 'text-neon-blue bg-neon-blue/10 border border-neon-blue/20'
        : 'text-cyan-200/70 hover:text-neon-green hover:bg-neon-green/5'
    }`

  const closeMenu = () => setMenuOpen(false)

  return (
    <nav className="sticky top-0 bg-bg-dark/80 shadow-neon z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
          <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/30 flex items-center justify-center group-hover:shadow-neon-glow transition-all duration-300">
            <span className="text-neon-blue font-mono font-bold text-sm">BC</span>
          </div>
          <span className="font-bold text-lg text-neon-blue neon-title tracking-tight">BrandCreator</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/" className={linkClass('/')}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>Dashboard</Link>
              <Link to="/messages" className={linkClass('/messages')}>Messages</Link>
              <Link to="/notifications" className={`${linkClass('/notifications')} inline-flex items-center gap-2`}>
                Notifications
                {unreadCount > 0 && <span className="badge badge-cyan animate-pulse">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className={linkClass('/profile')}>Profile</Link>
              {user.role === 'creator' && <Link to="/my-brands" className={linkClass('/my-brands')}>My Brands</Link>}
              {user.role === 'brand' && <Link to="/working-creators" className={linkClass('/working-creators')}>Creators</Link>}
              {user.role === 'admin' && <Link to="/admin" className={linkClass('/admin')}>Admin</Link>}
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

        {/* Mobile hamburger button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-neon-blue/10 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span className={`block w-5 h-0.5 bg-cyan-200/70 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-cyan-200/70 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-cyan-200/70 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-dim bg-bg-dark/95 backdrop-blur-md px-3 py-3 space-y-1 overflow-y-auto max-h-[60vh]">
          <Link to="/" className={mobileLinkClass('/')} onClick={closeMenu}>Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className={mobileLinkClass('/dashboard')} onClick={closeMenu}>Dashboard</Link>
              <Link to="/messages" className={mobileLinkClass('/messages')} onClick={closeMenu}>Messages</Link>
              <Link to="/notifications" className={`${mobileLinkClass('/notifications')} inline-flex items-center gap-2`} onClick={closeMenu}>
                Notifications
                {unreadCount > 0 && <span className="badge badge-cyan animate-pulse">{unreadCount}</span>}
              </Link>
              <Link to="/profile" className={mobileLinkClass('/profile')} onClick={closeMenu}>Profile</Link>
              {user.role === 'creator' && <Link to="/my-brands" className={mobileLinkClass('/my-brands')} onClick={closeMenu}>My Brands</Link>}
              {user.role === 'brand' && <Link to="/working-creators" className={mobileLinkClass('/working-creators')} onClick={closeMenu}>Creators</Link>}
              {user.role === 'admin' && <Link to="/admin" className={mobileLinkClass('/admin')} onClick={closeMenu}>Admin</Link>}
              <button
                onClick={() => { closeMenu(); logout(); }}
                className="block w-full text-left px-3 py-2.5 rounded-md text-xs sm:text-sm font-medium text-pink-400/80 hover:text-pink-300 hover:bg-pink-500/10 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={mobileLinkClass('/login')} onClick={closeMenu}>Login</Link>
              <Link to="/register" className={mobileLinkClass('/register')} onClick={closeMenu}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
