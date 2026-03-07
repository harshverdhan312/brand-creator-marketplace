import React, { useEffect, useState, useContext } from 'react'
import { getWorkingBrands, getEscrowsForCreator } from '../services/escrowService'
import { NotificationContext } from '../context/NotificationContext'
import { createCampaignForBrand } from '../services/campaignService'
import CampaignCard from '../components/CampaignCard'

export default function MyBrands() {
  const [brands, setBrands] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', budget: 0, category: '', deadline: '' })
  const [campaigns, setCampaigns] = useState([])
  const { add } = useContext(NotificationContext)

  useEffect(() => {
    getWorkingBrands().then(r => setBrands(r.data)).catch(() => {})
    // fetch creator escrows and extract campaigns
    getEscrowsForCreator().then(r => {
      const cvs = r.data.map(e => e.campaignId).filter(Boolean)
      setCampaigns(cvs)
    }).catch(() => {})
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      await createCampaignForBrand({ ...form, brandId: selected._id })
      add('Campaign request created', 'success')
      setForm({ title: '', description: '', budget: 0, category: '', deadline: '' })
    } catch (err) { add('Failed to create campaign', 'error') }
  }

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

      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Active Campaigns</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <CampaignCard key={c._id} id={c._id} title={c.title} description={c.description} budget={c.budget} deadline={c.deadline} />
          ))}
        </div>
      </section>

      {selected && (
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Create campaign for {selected.name}</h3>
          <form onSubmit={handleCreate} className="space-y-3">
            <input className="w-full p-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            <input className="w-full p-2 border rounded" placeholder="Budget (INR)" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
            <input className="w-full p-2 border rounded" placeholder="Category" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <input type="date" className="w-full p-2 border rounded" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <button className="px-4 py-2 bg-gray-800 text-white rounded">Request Campaign</button>
          </form>
        </div>
      )}
    </div>
  )
}
