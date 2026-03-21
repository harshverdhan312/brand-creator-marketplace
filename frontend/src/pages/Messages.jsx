import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import ChatBox from '../components/ChatBox'
import { myPitches, getPitchesForBrand } from '../services/pitchService'
import { searchUsers } from '../services/userService'

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
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchParams] = useSearchParams()

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

  useEffect(() => {
    const userIdFromQuery = searchParams.get('userId')
    if (userIdFromQuery) setSelectedConversation(userIdFromQuery)
  }, [searchParams])

  // Filter connected users by search query (local filter)
  const filteredConnected = searchQuery.trim()
    ? connected.filter(c => c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : connected

  // Search users via API for discovering new connections
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        const r = await searchUsers(searchQuery.trim())
        // Filter out self and already-connected users
        const connectedIds = new Set(connected.map(c => c.id))
        const results = (r.data || []).filter(u => u._id !== user?._id && !connectedIds.has(u._id))
        setSearchResults(results)
      } catch (e) {
        setSearchResults([])
      }
      setSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, connected, user])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-neon-pink" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Messages</h2>
      </div>
      <div className="card-dark p-0 flex flex-col md:flex-row overflow-hidden" style={{ minHeight: '400px' }}>
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border-dim p-4 flex-shrink-0">
          {/* Search input */}
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="input-dark text-xs"
              placeholder={user?.role === 'creator' ? 'Search brands...' : 'Search creators...'}
              aria-label="Search users"
            />
          </div>
          <div className="text-xs font-mono text-cyan-200/40 uppercase tracking-wider mb-3">
            {user?.role === 'creator' ? 'Brands' : 'Creators'}
          </div>
          {filteredConnected.length === 0 && !searchQuery && <div className="text-sm text-cyan-200/30">No connections yet.</div>}
          {filteredConnected.length === 0 && searchQuery && connected.length > 0 && <div className="text-sm text-cyan-200/30">No matching connections.</div>}
          <ul className="space-y-1">
            {filteredConnected.map(c => (
              <li key={c.id}>
                 <button
                   onClick={() => setSelectedConversation(c.id)}
                   className={`text-left w-full py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
                     selectedConversation === c.id
                       ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                       : 'text-cyan-200/60 hover:bg-surface-light hover:text-cyan-200/80 border border-transparent'
                   }`}
                >
                  {c.name || 'User'}
                </button>
              </li>
            ))}
          </ul>
          {/* Show search results from API (non-connected users) */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <>
              <div className="text-xs font-mono text-cyan-200/30 uppercase tracking-wider mt-4 mb-2">Other Users</div>
              <ul className="space-y-1">
                {searchResults.map(u => (
                  <li key={u._id}>
                     <button
                       onClick={() => setSelectedConversation(u._id)}
                       className={`text-left w-full py-2.5 px-3 rounded-lg text-sm transition-all duration-200 ${
                         selectedConversation === u._id
                           ? 'bg-neon-pink/10 text-neon-pink border border-neon-pink/20'
                           : 'text-cyan-200/40 hover:bg-surface-light hover:text-cyan-200/60 border border-transparent'
                       }`}
                    >
                      {u.name} <span className="text-xs text-cyan-200/20 ml-1">({u.role})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {searching && <div className="text-xs text-cyan-200/30 mt-2">Searching...</div>}
        </div>
        <div className="flex-1 p-4">
          {selectedConversation ? <ChatBox otherUserId={selectedConversation} /> : (
            <div className="flex items-center justify-center h-full text-cyan-200/30 text-sm">
              Select a connection to start messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
