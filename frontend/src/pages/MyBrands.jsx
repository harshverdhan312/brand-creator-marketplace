import React, { useEffect, useState, useContext } from 'react'
import { getWorkingBrands, getEscrowsForCreator } from '../services/escrowService'
import { myPitches } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'

function statusBadgeClass(status) {
  if (!status) return 'badge-cyan'
  if (status.includes('ACCEPTED') || status.includes('APPROVED') || status.includes('COMPLETED')) return 'badge-green'
  if (status.includes('REJECTED')) return 'badge-red'
  if (status.includes('DISPUTED')) return 'badge-pink'
  return 'badge-cyan'
}

export default function MyBrands() {
  const [brands, setBrands] = useState([])
  const [selected, setSelected] = useState(null)
    const [selectedPitches, setSelectedPitches] = useState([])
  const [form, setForm] = useState({ title: '', description: '', budget: 0, category: '', deadline: '' })
  const [campaigns, setCampaigns] = useState([])
  const { add } = useContext(NotificationContext)

  useEffect(() => {
    getWorkingBrands().then(r => setBrands(r.data)).catch(() => {})
      // load empty campaigns list (campaigns removed)
      getEscrowsForCreator().then(r => setCampaigns([])).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    add('Campaigns removed: creating campaigns is disabled', 'info')
  }

  React.useEffect(() => {
    if (!selected) return
    // fetch creator's pitches and filter by selected brand
    myPitches().then(r => {
      const filtered = r.data.filter(p => p.brand && p.brand.id === selected._id)
      setSelectedPitches(filtered)
    }).catch(() => setSelectedPitches([]))
  }, [selected])

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-neon-green" />
        <h2 className="text-2xl font-bold text-white tracking-tight">My Brands</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        {brands.map(b => (
          <div
            key={b._id}
            className={`card-dark p-5 cursor-pointer transition-all duration-200 ${selected?._id === b._id ? 'border-neon-blue/30 shadow-neon-sm' : ''}`}
            onClick={() => setSelected(b)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-neon-blue/10 border border-neon-blue/15 flex items-center justify-center flex-shrink-0">
                <span className="text-neon-blue font-mono text-sm font-bold">{b.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-white">{b.name}</div>
                <div className="text-sm text-cyan-200/40 truncate">{b.bio}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaigns removed from UI */}

      {selected && (
        <div className="card-dark p-6">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="section-title">Pitches to {selected.name}</h3>
            <span className="badge badge-cyan">{selectedPitches.length}</span>
          </div>
          <div className="space-y-3">
            {selectedPitches.length === 0 && <div className="text-sm text-cyan-200/40">No pitches yet to this brand.</div>}
            {selectedPitches.map(p => (
              <div key={p._id} className="p-4 rounded-lg bg-surface/50 border border-border-dim">
                <div className="font-medium text-white">{p.brand ? p.brand.name : selected.name}</div>
                <p className="text-sm text-cyan-200/50 mt-1">{p.message}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-cyan-200/35">
                  <span>Platforms: {(p.platforms || []).join(', ')}</span>
                  <span>{p.contentCount} items • {p.frequency} • ₹{p.pricePerContent}/item</span>
                </div>
                <span className={`badge ${statusBadgeClass(p.status)} mt-2`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
