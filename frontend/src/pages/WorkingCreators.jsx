import React, { useEffect, useState, useContext } from 'react'
import { getWorkingCreators } from '../services/escrowService'
import { NotificationContext } from '../context/NotificationContext'
import { AuthContext } from '../context/AuthContext'

export default function WorkingCreators() {
  const [creators, setCreators] = useState([])
  const [pending, setPending] = useState([])
  const { user } = useContext(AuthContext)
  const { add } = useContext(NotificationContext)

  useEffect(() => {
    getWorkingCreators().then(r => setCreators(r.data)).catch(() => {})
  }, [user])

  const refreshPending = () => {}

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Creators You're Working With</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {creators.map(c => (
          <div key={c._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{c.name}</div>
            <div className="text-sm text-gray-600">{c.bio}</div>
          </div>
        ))}
      </div>
      
      {/* Campaigns removed from UI */}
    </div>
  )
}
