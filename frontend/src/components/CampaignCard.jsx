import React from 'react'
import { Link } from 'react-router-dom'

export default function CampaignCard({ title, description, budget, deadline, id }) {
  return (
    <Link to={`/campaigns/${id}`} className="block bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="font-medium">${budget}</span>
        <span className="text-sm text-gray-500">{deadline ? new Date(deadline).toLocaleDateString() : 'No deadline'}</span>
      </div>
    </Link>
  )
}
