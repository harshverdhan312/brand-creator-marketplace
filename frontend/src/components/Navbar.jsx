import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="font-bold text-lg">BrandCreator</Link>
        <div className="flex items-center space-x-4">
          <Link to="/">Home</Link>
          {user ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/messages">Messages</Link>
              <Link to="/profile">Profile</Link>
              {user.role === 'creator' && <Link to="/my-brands">My Brands</Link>}
              {user.role === 'brand' && <Link to="/working-creators">Creators</Link>}
              <button onClick={logout} className="text-sm text-red-500">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="ml-2 px-3 py-1 bg-gray-800 text-white rounded">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
