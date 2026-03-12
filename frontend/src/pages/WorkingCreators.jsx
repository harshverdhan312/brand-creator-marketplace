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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-neon-pink" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Working Creators</h2>
        <span className="badge badge-pink">{creators.length}</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {creators.map(c => (
          <div key={c._id} className="card-dark p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neon-pink/10 border border-neon-pink/15 flex items-center justify-center flex-shrink-0">
                <span className="text-neon-pink font-mono text-sm font-bold">{c.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white">{c.name}</div>
                <div className="text-sm text-cyan-200/40 truncate">{c.bio}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Campaigns removed from UI */}
    </div>
  )
}
