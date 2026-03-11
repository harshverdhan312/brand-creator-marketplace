import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="dark:bg-bg-dark border-b border-transparent shadow-neon">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-extrabold text-lg text-neon-blue neon-title">BrandCreator</Link>
        <div className="flex items-center space-x-4 text-sm text-cyan-100">
          <Link to="/" className="hover:text-neon-green">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-neon-green">Dashboard</Link>
              <Link to="/messages" className="hover:text-neon-green">Messages</Link>
              <Link to="/profile" className="hover:text-neon-green">Profile</Link>
              {user.role === 'creator' && <Link to="/my-brands" className="hover:text-neon-green">My Brands</Link>}
              {user.role === 'brand' && <Link to="/working-creators" className="hover:text-neon-green">Creators</Link>}
              <button onClick={logout} className="text-sm text-pink-400 hover:text-pink-300">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-neon-green">Login</Link>
              <Link to="/register" className="ml-2 btn-neon primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
