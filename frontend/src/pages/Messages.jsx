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
    <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Messages</h2>
      <div className="flex gap-4">
        <div className="w-1/3 border-r pr-3">
          <div className="text-sm text-gray-600 mb-2">Connected {user?.role === 'creator' ? 'Brands' : 'Creators'}</div>
          {connected.length === 0 && <div className="text-sm text-gray-500">No connections yet.</div>}
          <ul className="space-y-2">
            {connected.map(c => (
              <li key={c.id} className="flex items-center justify-between">
                <button onClick={() => setSelected(c.id)} className={`text-left w-full py-2 px-2 rounded ${selected === c.id ? 'bg-gray-100' : ''}`}>
                  {c.name || 'User'}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          {selected ? <ChatBox otherUserId={selected} /> : <div className="text-gray-500">Select a connection to start messaging.</div>}
        </div>
      </div>
    </div>
  )
}
