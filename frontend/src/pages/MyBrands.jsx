import React, { useEffect, useState, useContext } from 'react'
import { getWorkingBrands, getEscrowsForCreator } from '../services/escrowService'
import { myPitches } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'

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
      <h2 className="text-2xl font-semibold mb-4">Brands You're Working For</h2>
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {brands.map(b => (
          <div key={b._id} className="bg-white p-4 rounded shadow cursor-pointer" onClick={() => setSelected(b)}>
            <div className="font-semibold">{b.name}</div>
            <div className="text-sm text-gray-600">{b.bio}</div>
          </div>
        ))}
      </div>

      {/* Campaigns removed from UI */}

      {selected && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Pitches to {selected.name}</h3>
          <div className="space-y-3">
            {selectedPitches.length === 0 && <div className="text-sm text-gray-600">No pitches yet to this brand.</div>}
            {selectedPitches.map(p => (
              <div key={p._id} className="p-3 border rounded">
                <div className="font-medium">{p.brand ? p.brand.name : selected.name}</div>
                <div className="text-sm text-gray-600">{p.message}</div>
                <div className="text-sm">Platforms: {(p.platforms || []).join(', ')}</div>
                <div className="text-sm">Content: {p.contentCount} • {p.frequency} • {p.pricePerContent} INR/item</div>
                <div className="text-sm text-gray-500">Status: {p.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
