import React from 'react'
import { Link } from 'react-router-dom'

export default function CreatorCard({ creator }) {
  return (
    <div className="card-dark p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/15 flex items-center justify-center flex-shrink-0">
          <span className="text-neon-pink font-mono text-sm font-bold">{creator.name?.charAt(0)?.toUpperCase()}</span>
        </div>
        <div className="min-w-0">
          <Link to={`/profile/${creator._id}`} className="font-semibold text-white hover:text-neon-pink transition-colors truncate block">{creator.name}</Link>
          <p className="text-sm text-cyan-200/40 truncate">{creator.bio}</p>
        </div>
      </div>
    </div>
  )
}
