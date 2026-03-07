import React, { useState, useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'
import { createCampaign } from '../services/campaignService'
import { useNavigate } from 'react-router-dom'

export default function CreateCampaign() {
  const [form, setForm] = useState({ title: '', description: '', budget: 0, category: '', deadline: '' })
  const navigate = useNavigate()

  const { add } = useContext(NotificationContext)
  const handle = async (e) => {
    e.preventDefault()
    try {
      await createCampaign({ ...form, budget: Number(form.budget) })
      add && add('Campaign created', 'success')
      navigate('/dashboard')
    } catch (err) { add && add('Failed to create campaign', 'error') }
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Create Campaign</h2>
      <form className="space-y-3" onSubmit={handle}>
        <input className="w-full p-2 border rounded" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <textarea className="w-full p-2 border rounded" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Budget (INR) e.g. 5000" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} />
        <input className="w-full p-2 border rounded" placeholder="Category e.g. Beauty, Tech" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input type="date" className="w-full p-2 border rounded" placeholder="Deadline" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
        <button className="w-full bg-gray-800 text-white py-2 rounded">Create</button>
      </form>
    </div>
  )
}
