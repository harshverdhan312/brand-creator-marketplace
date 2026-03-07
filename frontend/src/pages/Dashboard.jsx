import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { getBrandCampaigns, listOpen } from '../services/campaignService'
import CampaignCard from '../components/CampaignCard'
import { myPitches as fetchMyPitches, getPitchesForBrand, acceptPitch, rejectPitch } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'
import PitchCard from '../components/PitchCard'

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [campaigns, setCampaigns] = useState([])
  const [pitches, setPitches] = useState([])
  const [myPitches, setMyPitches] = useState([])
  const { add } = React.useContext(NotificationContext)

  useEffect(() => {
    if (!user) return
      if (user.role === 'brand') {
      // brand: show campaigns they created and pitches received
      getBrandCampaigns().then(r => setCampaigns(r.data)).catch(() => {})
      getPitchesForBrand().then(r => setPitches(r.data)).catch(() => {})
    } else {
      // creator: show open campaigns and their pitches
      listOpen().then(r => setCampaigns(r.data)).catch(() => {})
      fetchMyPitches().then(r => setMyPitches(r.data)).catch(() => {})
    }
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-gray-600">Welcome, {user?.name}</p>
      {/* Campaigns removed from Dashboard per UI update; creators see campaigns on My Brands page */}

      {user?.role === 'brand' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Pitches Received</h3>
          <div className="grid grid-cols-1 gap-3">
            {pitches.map(p => (
              <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between items-start">
                <div>
                  <div className="font-semibold">{p.creatorId?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-600">{p.message}</div>
                  <div className="text-sm text-gray-700 mt-2">{p.priceAmount} {p.priceUnit} (INR)</div>
                </div>
                <div className="flex flex-col gap-2">
                        {p.status === 'pending' && (
                          <button onClick={async () => { try { await acceptPitch(p._id); const r = await getPitchesForBrand(); setPitches(r.data); add('Pitch accepted', 'success'); } catch (e) { add('Failed to accept pitch', 'error') } }} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>
                        )}
                        {p.status === 'pending' && (
                          <button onClick={async () => { try { await rejectPitch(p._id); const r = await getPitchesForBrand(); setPitches(r.data); add('Pitch rejected', 'info'); } catch (e) { add('Failed to reject pitch', 'error') } }} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
                        )}
                  <div className="text-sm text-gray-500">{p.status}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {user?.role === 'creator' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Pitches</h3>
          <div className="grid grid-cols-1 gap-3">
            {myPitches.map(p => (
              <div key={p._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{p.brand ? p.brand.name : (p.campaign ? p.campaign.title : '—')}</div>
                    <div className="text-sm text-gray-600">{p.message}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{p.priceAmount} {p.priceUnit} (INR)</div>
                    <div className="text-sm text-gray-500">{p.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
