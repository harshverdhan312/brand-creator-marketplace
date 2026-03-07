import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { getCampaign } from '../services/campaignService'
import { AuthContext } from '../context/AuthContext'
import PitchCard from '../components/PitchCard'
import { sendPitch, listForCampaign } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'
import { approveCampaign, rejectCampaign } from '../services/campaignService'

export default function CampaignDetails() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [data, setData] = useState(null)
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('per piece')
  const { add } = useContext(NotificationContext)

  useEffect(() => {
    getCampaign(id).then(r => setData(r.data)).catch(() => {})
  }, [id])

  const handlePitch = async (e) => {
    e.preventDefault()
    try {
      await sendPitch({ campaignId: id, message, priceAmount: Number(price), priceUnit: unit, currency: 'INR' })
      if (add) add('Pitch sent', 'success')
      setMessage('')
      setPrice('')
    } catch (err) {
      if (add) add('Error sending pitch', 'error')
    }
  }

  return (
    <div>
      {!data ? <div>Loading...</div> : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold">{data.campaign.title}</h2>
            <p className="mt-2 text-gray-600">{data.campaign.description}</p>
            {data.escrow && (
              <div className="mt-4 p-3 bg-gray-50 rounded">
                <div className="font-medium">Escrow</div>
                <div className="text-sm text-gray-700">Amount: {data.escrow.amount} INR</div>
                <div className="text-sm text-gray-600">Status: {data.escrow.status}</div>
              </div>
            )}
          </div>
          <div className="bg-white p-6 rounded shadow">
            {user?.role === 'creator' && (
              <form onSubmit={handlePitch} className="space-y-3">
                <textarea className="w-full p-2 border rounded" placeholder="Pitch message" value={message} onChange={e => setMessage(e.target.value)} />
                <input className="w-full p-2 border rounded" placeholder="Price quote" value={price} onChange={e => setPrice(e.target.value)} />
                <button className="w-full bg-gray-800 text-white py-2 rounded">Send Pitch</button>
              </form>
            )}
            {user?.role === 'brand' && (
              <div>
                {data.campaign.status === 'pending' && String(data.campaign.brand._id) === String(user._id) && (
                  <div className="mb-4 flex gap-2">
                    <button onClick={async () => { try { const res = await approveCampaign(data.campaign._id); setData(prev => ({ ...prev, campaign: res.data.campaign, escrow: res.data.escrow })); add && add('Campaign approved and escrow created', 'success') } catch (e) { add && add('Failed to approve', 'error') } }} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                    <button onClick={async () => { try { await rejectCampaign(data.campaign._id); setData(prev => ({ ...prev, campaign: { ...prev.campaign, status: 'rejected' } })); add && add('Campaign rejected', 'info') } catch (e) { add && add('Failed to reject', 'error') } }} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                  </div>
                )}
                <h3 className="font-semibold mb-2">Pitches</h3>
                {data.pitches.map(p => (
                  <PitchCard key={p._id} creatorName={p.creatorId.name} message={p.message} priceAmount={p.priceAmount} priceUnit={p.priceUnit} status={p.status} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
