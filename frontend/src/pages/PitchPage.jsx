import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { getPitchesForBrand, myPitches } from '../services/pitchService'

function statusBadgeClass(status) {
  if (!status) return 'badge-cyan'
  if (status.includes('ACCEPTED') || status.includes('APPROVED') || status.includes('COMPLETED')) return 'badge-green'
  if (status.includes('REJECTED')) return 'badge-red'
  if (status.includes('DISPUTED')) return 'badge-pink'
  if (status.includes('SUBMITTED') || status.includes('PENDING')) return 'badge-amber'
  return 'badge-cyan'
}

export default function PitchPage() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const [pitches, setPitches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      setLoading(true)
      try {
        const r = user.role === 'brand' ? await getPitchesForBrand() : await myPitches()
        setPitches(r.data || [])
      } catch (e) {
        setPitches([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const selectedPitch = useMemo(() => {
    if (!id) return null
    return pitches.find((p) => String(p._id) === String(id)) || null
  }, [pitches, id])

  return (
    <div className="max-w-2xl mx-auto card-dark p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1.5 h-8 rounded-full bg-neon-blue" />
        <h2 className="text-xl font-bold text-white">Pitch Details</h2>
      </div>
      {loading && <p className="text-cyan-200/40 text-sm">Loading pitch data...</p>}
      {!loading && id && !selectedPitch && (
        <p className="text-cyan-200/40 text-sm">Pitch not found or you do not have access.</p>
      )}
      {!loading && id && selectedPitch && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-cyan-200/70">
              {user?.role === 'brand' ? (selectedPitch.creatorId?.name || 'Creator') : (selectedPitch.brand?.name || 'Brand')}
            </div>
            <span className={`badge ${statusBadgeClass(selectedPitch.status)}`}>{selectedPitch.status}</span>
          </div>
          <p className="text-cyan-200/70 text-sm">{selectedPitch.message}</p>
          <div className="text-xs font-mono text-cyan-200/45">Amount: ₹{selectedPitch.priceAmount}</div>
          <div className="pt-2">
            <Link to="/dashboard" className="btn-action btn-ghost text-xs">Open Dashboard</Link>
          </div>
        </div>
      )}
      {!loading && !id && (
        <div className="space-y-2">
          <p className="text-cyan-200/40 text-sm">Select a pitch from notifications or dashboard to view details.</p>
          <Link to="/dashboard" className="btn-action btn-ghost text-xs">Go to Dashboard</Link>
        </div>
      )}
    </div>
  )
}
