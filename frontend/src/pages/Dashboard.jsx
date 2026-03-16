import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { myPitches as fetchMyPitches, getPitchesForBrand } from '../services/pitchService'
import { getSubmissionsForBrand, acceptSubmission, rejectSubmission, getSubmissionsForCreator, createSubmission } from '../services/submissionService'
import { NotificationContext } from '../context/NotificationContext'
import PitchCard from '../components/PitchCard'
import { acceptPitch, rejectPitch } from '../services/pitchService'

function statusBadgeClass(status) {
  if (!status) return 'badge-cyan'
  if (status.includes('ACCEPTED') || status.includes('APPROVED') || status.includes('COMPLETED')) return 'badge-green'
  if (status.includes('REJECTED')) return 'badge-red'
  if (status.includes('DISPUTED')) return 'badge-pink'
  if (status.includes('SUBMITTED') || status.includes('PENDING')) return 'badge-amber'
  return 'badge-cyan'
}

function BrandDecision({ p, refresh, add }) {
  const [feedback, setFeedback] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  return (
    <div className="space-y-2">
      <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Message to creator" className="input-dark min-h-[60px] text-xs" />
      <div className="flex gap-2">
        <button onClick={async () => { setLoading(true); try { await acceptPitch(p._id, { message: feedback }); await refresh(); add('Pitch accepted', 'success'); } catch (e) { add('Failed to accept pitch', 'error') } setLoading(false); }} className="btn-action btn-success text-xs">{loading ? '...' : 'Accept'}</button>
        <button onClick={async () => { setLoading(true); try { await rejectPitch(p._id, { message: feedback }); await refresh(); add('Pitch rejected', 'info'); } catch (e) { add('Failed to reject pitch', 'error') } setLoading(false); }} className="btn-action btn-danger text-xs">{loading ? '...' : 'Reject'}</button>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useContext(AuthContext)
  const [campaigns, setCampaigns] = useState([])
  const [pitches, setPitches] = useState([])
  const [myPitches, setMyPitches] = useState([])
  const [brandSubmissions, setBrandSubmissions] = useState([])
  const [creatorSubmissions, setCreatorSubmissions] = useState([])
  const [viewing, setViewing] = useState(null) // { pitchId }
  const { add } = React.useContext(NotificationContext)

  useEffect(() => {
    if (!user) return
    if (user.role === 'brand') {
      // show pitches received for brand
      getPitchesForBrand().then(r => setPitches(r.data)).catch(() => {})
      // load submissions for brand
      getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)).catch(()=>{})
    } else {
      // creator: show their pitches
      fetchMyPitches().then(r => setMyPitches(r.data)).catch(() => {})
      // load creator submissions
      getSubmissionsForCreator().then(r => setCreatorSubmissions(r.data)).catch(()=>{})
    }
  }, [user])

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <div className="w-1.5 h-8 rounded-full bg-neon-blue" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Dashboard</h2>
      </div>
      <p className="text-cyan-200/40 text-sm mb-8 ml-5">Welcome back, <span className="text-neon-blue font-medium">{user?.name}</span></p>
      {/* Campaigns removed from Dashboard */}

      {user?.role === 'brand' && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h3 className="section-title">Pitches Received</h3>
            <span className="badge badge-cyan">{pitches.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {pitches.map(p => (
              <div key={p._id} className="card-dark p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-md bg-neon-pink/10 border border-neon-pink/15 flex items-center justify-center">
                        <span className="text-neon-pink font-mono text-xs font-bold">{(p.creatorId?.name || 'U').charAt(0)}</span>
                      </div>
                      <span className="font-semibold text-white">{p.creatorId?.name || 'Unknown'}</span>
                    </div>
                    <p className="text-sm text-cyan-200/50">{p.message}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-cyan-200/35">
                      <span>₹{p.priceAmount} {p.priceUnit}</span>
                      <span>Platforms: {(p.platforms || []).join(', ')}</span>
                      <span>{p.contentCount} items • {p.frequency} • ₹{p.pricePerContent}/item</span>
                    </div>
                    {(p.conversation || []).length > 0 && (
                      <div className="mt-3 p-3 rounded-lg bg-surface/50 border border-border-dim">
                        <div className="text-xs font-mono text-cyan-200/40 mb-1.5 uppercase tracking-wider">Thread</div>
                        {(p.conversation || []).map((c, i) => (
                          <div key={i} className="text-xs text-cyan-200/40">
                            <span className="text-neon-blue/60 font-medium">{String(c.sender) === String(p.creatorId?._id || p.creatorId) ? 'Creator' : 'Brand'}:</span> {c.message}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="w-44 flex-shrink-0 space-y-2">
                    {p.status === 'PITCH_SUBMITTED' && (
                      <BrandDecision p={p} refresh={() => getPitchesForBrand().then(r => setPitches(r.data))} add={add} />
                    )}
                    {(p.status === 'WORK_SUBMITTED' || brandSubmissions.some(s => String(s.pitchId) === String(p._id))) && (
                      <button onClick={() => setViewing({ pitchId: p._id })} className="btn-action btn-primary w-full text-xs">View Work</button>
                    )}
                    <span className={`badge ${statusBadgeClass(p.status)}`}>{p.status}</span>
                  </div>
                </div>
              </div>
            ))}
            {pitches.length === 0 && <div className="text-cyan-200/40 text-sm">No pitches received yet.</div>}
          </div>
        </section>
      )}

      {/* View Work Modal for Brand */}
      {viewing && (
        <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50">
          <div className="card-dark p-6 w-11/12 max-w-3xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-5">
              <h4 className="section-title">Work Submissions</h4>
              <button onClick={() => { setViewing(null); getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)).catch(()=>{}) }} className="btn-action btn-ghost text-xs">Close</button>
            </div>
            <div className="space-y-4">
              {brandSubmissions.filter(s => String(s.pitchId) === String(viewing.pitchId)).map(s => (
                <div key={s._id} className="p-4 rounded-lg bg-surface/50 border border-border-dim">
                  <div className="text-xs font-mono text-cyan-200/35">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                  <div className="mt-3">
                    <div className="text-xs font-mono text-cyan-200/50 uppercase tracking-wider mb-1">Deliverables</div>
                    <ul className="list-none space-y-1">
                      {(s.deliverables || []).map((d,i) => (
                        <li key={i}>
                          <a className="text-neon-blue hover:text-neon-green transition-colors text-sm font-mono" href={d.url} target="_blank" rel="noreferrer">{d.url}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-2 text-sm text-cyan-200/50">Notes: {s.notes || '-'}</div>
                  <div className="mt-2"><span className={`badge ${statusBadgeClass(s.status)}`}>{s.status}</span></div>
                  <div className="mt-3 flex gap-2">
                    {s.status !== 'ACCEPTED' && <button onClick={async () => { try { await acceptSubmission(s._id); add('Submission accepted and escrow released', 'success'); setViewing(null); getPitchesForBrand().then(r => setPitches(r.data)); getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)); getSubmissionsForCreator().then(r => setCreatorSubmissions(r.data)); } catch (e) { add('Failed to accept', 'error') } }} className="btn-action btn-success text-xs">Accept</button>}
                    {s.status !== 'REJECTED' && <RejectButton submission={s} refresh={() => { getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)); getPitchesForBrand().then(r => setPitches(r.data)); getSubmissionsForCreator().then(r => setCreatorSubmissions(r.data)); setViewing(null); }} add={add} />}
                  </div>
                </div>
              ))}
              {brandSubmissions.filter(s => String(s.pitchId) === String(viewing.pitchId)).length === 0 && <div className="text-cyan-200/40 text-sm">No submissions found for this pitch.</div>}
            </div>
          </div>
        </div>
      )}

      {user?.role === 'creator' && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <h3 className="section-title">Your Pitches</h3>
            <span className="badge badge-cyan">{myPitches.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {myPitches.map(p => (
              <CreatorPitchItem key={p._id} p={p} refresh={() => fetchMyPitches().then(r => setMyPitches(r.data)).catch(()=>{})} />
            ))}
            {myPitches.length === 0 && <div className="text-cyan-200/40 text-sm">No pitches yet. Go to the Marketplace to pitch to brands.</div>}
          </div>
        </section>
      )}

      {user?.role === 'creator' && (
        <section className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="section-title">My Submissions</h3>
            <span className="badge badge-pink">{creatorSubmissions.length}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {creatorSubmissions.map(s => (
              <div key={s._id} className="card-dark p-5">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white">{s.brandId?.name || 'Brand'}</div>
                    <div className="text-xs font-mono text-cyan-200/35 mt-1">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                    <div className="text-sm text-cyan-200/50 mt-2">Notes: {s.notes || '-'}</div>
                    {s.status === 'REJECTED' && <div className="mt-2 text-sm text-red-400/80">Rejected: {s.rejectionReason || 'No reason provided'}</div>}
                  </div>
                  <span className={`badge ${statusBadgeClass(s.status)} flex-shrink-0`}>{s.status}</span>
                </div>
              </div>
            ))}
            {creatorSubmissions.length === 0 && <div className="text-cyan-200/40 text-sm">No submissions yet.</div>}
          </div>
        </section>
      )}
    </div>
  )
}

function CreatorPitchItem({ p, refresh }) {
  const [open, setOpen] = React.useState(false)
  const [links, setLinks] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const { add } = React.useContext(NotificationContext)
  const handleSubmit = async () => {
    if (!p.escrowId) return add('No escrow; cannot submit', 'error')
    try {
      await createSubmission({ escrowId: p.escrowId, pitchId: p._id, deliverables: links.split(',').map(u => ({ type: 'link', url: u.trim() })), notes })
      add('Submission created', 'success')
      setOpen(false)
      refresh()
    } catch (e) { add('Failed to submit', 'error') }
  }
  return (
    <div className="card-dark p-5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white">{p.brand?.name}</div>
          <p className="text-sm text-cyan-200/50 mt-1">{p.message}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono font-semibold text-white">₹{p.priceAmount}</div>
          <div className="text-xs text-cyan-200/35">{p.priceUnit}</div>
          <span className={`badge ${statusBadgeClass(p.status)} mt-1`}>{p.status}</span>
          {p.escrowId && <div className="mt-2"><button onClick={() => setOpen(!open)} className="btn-action btn-primary text-xs">{open ? 'Cancel' : 'Submit Work'}</button></div>}
        </div>
      </div>
      {open && (
        <div className="mt-4 border-t border-border-dim pt-4 space-y-3">
          <input value={links} onChange={e => setLinks(e.target.value)} className="input-dark" placeholder="Deliverable links (comma separated)" />
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="input-dark min-h-[60px]" placeholder="Notes" />
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="btn-action btn-success">Submit</button>
          </div>
        </div>
      )}
    </div>
  )
}

function RejectButton({ submission, refresh, add }) {
  const [open, setOpen] = React.useState(false)
  const [reason, setReason] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const doReject = async () => {
    if (!reason) return add('Please provide a rejection reason', 'error')
    setLoading(true)
    try {
      await rejectSubmission(submission._id, { reason })
      add('Submission rejected', 'info')
      refresh()
    } catch (e) { add('Failed to reject', 'error') }
    setLoading(false)
  }
  return (
    <div>
      {!open && <button onClick={() => setOpen(true)} className="btn-action btn-danger text-xs">Reject</button>}
      {open && (
        <div className="mt-2 space-y-2">
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Rejection feedback (required)" className="input-dark min-h-[50px] text-xs" />
          <div className="flex gap-2">
            <button onClick={doReject} className="btn-action btn-danger text-xs">{loading ? '...' : 'Submit Rejection'}</button>
            <button onClick={() => setOpen(false)} className="btn-action btn-ghost text-xs">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
