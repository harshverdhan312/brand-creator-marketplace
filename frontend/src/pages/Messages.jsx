import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import ChatBox from '../components/ChatBox'
import { myPitches, getPitchesForBrand } from '../services/pitchService'

const acceptedStatuses = [
  'PITCH_ACCEPTED',
  'WORK_IN_PROGRESS',
  'WORK_SUBMITTED',
  'APPROVAL_PENDING',
  'APPROVED',
  'DISPUTED',
  'COMPLETED'
]

function uniqueById(arr) {
  const map = {}
  for (const it of arr) map[it.id] = it
  return Object.values(map)
}

export default function Messages() {
  const { user } = useContext(AuthContext)
  const [connected, setConnected] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      try {
        if (user.role === 'creator') {
          const r = await myPitches()
          const picks = (r.data || []).filter(p => acceptedStatuses.includes(p.status) && p.brand).map(p => ({ id: p.brand.id || p.brandId, name: p.brand.name }))
          setConnected(uniqueById(picks))
        } else if (user.role === 'brand') {
          const r = await getPitchesForBrand()
          const picks = (r.data || []).filter(p => acceptedStatuses.includes(p.status) && p.creatorId).map(p => ({ id: p.creatorId._id || p.creatorId, name: p.creatorId.name }))
          setConnected(uniqueById(picks))
        } else {
          setConnected([])
        }
      } catch (e) {
        setConnected([])
      }
    }
    load()
  }, [user])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-neon-pink" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
      </div>
      <div className="card-dark p-0 flex overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="w-64 border-r border-border-dim p-4 flex-shrink-0">
          <div className="text-xs font-mono text-cyan-200/40 uppercase tracking-wider mb-3">
            {user?.role === 'creator' ? 'Brands' : 'Creators'}
          </div>
          {connected.length === 0 && <div className="text-sm text-cyan-200/30">No connections yet.</div>}
          <ul className="space-y-1">
            {connected.map(c => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c.id)}
                  className={`text-left w-full py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
                    selected === c.id
                      ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                      : 'text-cyan-200/60 hover:bg-surface-light hover:text-cyan-200/80 border border-transparent'
                  }`}
                >
                  {c.name || 'User'}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 p-4">
          {selected ? <ChatBox otherUserId={selected} /> : (
            <div className="flex items-center justify-center h-full text-cyan-200/30 text-sm">
              Select a connection to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
