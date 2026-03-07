import React, { useEffect, useState, useContext } from 'react'
import { getWorkingCreators } from '../services/escrowService'
import { getPendingForBrand, approveCampaign, rejectCampaign, getBrandCampaigns, listOpen } from '../services/campaignService'
import { NotificationContext } from '../context/NotificationContext'
import { AuthContext } from '../context/AuthContext'
import CampaignCard from '../components/CampaignCard'

export default function WorkingCreators() {
  const [creators, setCreators] = useState([])
  const [pending, setPending] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const { user } = useContext(AuthContext)
  const { add } = useContext(NotificationContext)

  useEffect(() => {
    getWorkingCreators().then(r => setCreators(r.data)).catch(() => {})
    getPendingForBrand().then(r => setPending(r.data)).catch(() => {})
    if (!user) return
    if (user.role === 'brand') {
      getBrandCampaigns().then(r => setCampaigns(r.data)).catch(() => {})
    } else {
      listOpen().then(r => setCampaigns(r.data)).catch(() => {})
    }
  }, [user])

  const refreshPending = () => getPendingForBrand().then(r => setPending(r.data)).catch(() => {})
  const refreshCampaigns = () => {
    if (!user) return
    if (user.role === 'brand') return getBrandCampaigns().then(r => setCampaigns(r.data)).catch(() => {})
    return listOpen().then(r => setCampaigns(r.data)).catch(() => {})
  }

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
      
      <section className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Campaigns</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {campaigns.map(c => (
            <CampaignCard key={c._id} id={c._id} title={c.title} description={c.description} budget={c.budget} deadline={c.deadline} />
          ))}
        </div>
      </section>
    </div>
  )
}
