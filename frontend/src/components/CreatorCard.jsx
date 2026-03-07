import React from 'react'
import { Link } from 'react-router-dom'

export default function CreatorCard({ creator }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="font-semibold"><Link to={`/profile/${creator._id}`}>{creator.name}</Link></div>
      <div className="text-sm text-gray-600">{creator.bio}</div>
    </div>
  )
}
