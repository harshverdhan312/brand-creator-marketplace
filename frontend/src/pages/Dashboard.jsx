import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { myPitches as fetchMyPitches, getPitchesForBrand } from '../services/pitchService'
import { getSubmissionsForBrand, acceptSubmission, rejectSubmission, getSubmissionsForCreator } from '../services/submissionService'
import { NotificationContext } from '../context/NotificationContext'
import PitchCard from '../components/PitchCard'
import ReactDOM from 'react-dom'
import { acceptPitch, rejectPitch } from '../services/pitchService'

function BrandDecision({ p, refresh, add }) {
  const [feedback, setFeedback] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  return (
    <div>
      <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Message to creator" className="w-full p-2 border rounded mb-2" />
      <div className="flex gap-2">
        <button onClick={async () => { setLoading(true); try { await acceptPitch(p._id, { message: feedback }); await refresh(); add('Pitch accepted', 'success'); } catch (e) { add('Failed to accept pitch', 'error') } setLoading(false); }} className="px-3 py-1 bg-green-600 text-white rounded">{loading ? '...' : 'Accept'}</button>
        <button onClick={async () => { setLoading(true); try { await rejectPitch(p._id, { message: feedback }); await refresh(); add('Pitch rejected', 'info'); } catch (e) { add('Failed to reject pitch', 'error') } setLoading(false); }} className="px-3 py-1 bg-red-600 text-white rounded">{loading ? '...' : 'Reject'}</button>
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
      <h2 className="text-2xl font-semibold">Dashboard</h2>
      <p className="text-gray-600">Welcome, {user?.name}</p>
      {/* Campaigns removed from Dashboard */}

      {user?.role === 'brand' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Pitches Received</h3>
          <div className="grid grid-cols-1 gap-3">
            {pitches.map(p => (
              <div key={p._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{p.creatorId?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-600">{p.message}</div>
                    <div className="text-sm text-gray-700 mt-2">{p.priceAmount} {p.priceUnit} (INR)</div>
                    <div className="text-sm text-gray-700 mt-1">Platforms: {(p.platforms || []).join(', ')}</div>
                    <div className="text-sm text-gray-700">Content: {p.contentCount} items • {p.frequency} • {p.pricePerContent} INR/item</div>
                    <div className="mt-2 text-sm">
                      <strong>Conversation:</strong>
                      <div className="text-xs text-gray-600 mt-1">
                        {(p.conversation || []).map((c, i) => (
                          <div key={i}><span className="font-medium">{String(c.sender) === String(p.creatorId?._id || p.creatorId) ? 'Creator' : 'Brand'}:</span> {c.message}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="w-40">
                    {p.status === 'PITCH_SUBMITTED' && (
                      <BrandDecision p={p} refresh={() => getPitchesForBrand().then(r => setPitches(r.data))} add={add} />
                    )}
                    {/* show view work if there are submissions for this pitch or status indicates work submitted */}
                    {(p.status === 'WORK_SUBMITTED' || brandSubmissions.some(s => String(s.pitchId) === String(p._id))) && (
                      <div className="mt-2"><button onClick={() => setViewing({ pitchId: p._id })} className="px-3 py-1 bg-indigo-600 text-white rounded">View Work</button></div>
                    )}
                    <div className="text-sm text-gray-500 mt-2">{p.status}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* View Work Modal for Brand */}
      {viewing && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded w-11/12 max-w-3xl">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Work Submissions</h4>
              <button onClick={() => { setViewing(null); getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)).catch(()=>{}) }} className="text-gray-600">Close</button>
            </div>
            <div>
              {brandSubmissions.filter(s => String(s.pitchId) === String(viewing.pitchId)).map(s => (
                <div key={s._id} className="border p-3 rounded mb-3">
                  <div className="text-sm text-gray-600">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                  <div className="mt-2">
                    <div className="font-medium">Deliverables</div>
                    <ul className="list-disc pl-5 text-sm">
                      {(s.deliverables || []).map((d,i) => (<li key={i}><a className="text-blue-600" href={d.url} target="_blank" rel="noreferrer">{d.url}</a></li>))}
                    </ul>
                  </div>
                  <div className="mt-2 text-sm">Notes: {s.notes || '-'}</div>
                  <div className="mt-2 text-sm">Status: {s.status}</div>
                  <div className="mt-3 flex gap-2">
                    {s.status !== 'ACCEPTED' && <button onClick={async () => { try { await acceptSubmission(s._id); add('Submission accepted and escrow released', 'success'); setViewing(null); getPitchesForBrand().then(r => setPitches(r.data)); getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)); getSubmissionsForCreator().then(r => setCreatorSubmissions(r.data)); } catch (e) { add('Failed to accept', 'error') } }} className="px-3 py-1 bg-green-600 text-white rounded">Accept</button>}
                    {s.status !== 'REJECTED' && <RejectButton submission={s} refresh={() => { getSubmissionsForBrand().then(r => setBrandSubmissions(r.data)); getPitchesForBrand().then(r => setPitches(r.data)); getSubmissionsForCreator().then(r => setCreatorSubmissions(r.data)); setViewing(null); }} add={add} />}
                  </div>
                </div>
              ))}
              {brandSubmissions.filter(s => String(s.pitchId) === String(viewing.pitchId)).length === 0 && <div className="text-gray-500">No submissions found for this pitch.</div>}
            </div>
          </div>
        </div>
      )}

      {user?.role === 'creator' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Your Pitches</h3>
          <div className="grid grid-cols-1 gap-3">
            {myPitches.map(p => (
              <CreatorPitchItem key={p._id} p={p} refresh={() => fetchMyPitches().then(r => setMyPitches(r.data)).catch(()=>{})} />
            ))}
          </div>
        </section>
      )}

      {user?.role === 'creator' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">My Submissions</h3>
          <div className="grid grid-cols-1 gap-3">
            {creatorSubmissions.map(s => (
              <div key={s._id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{s.brandId?.name || 'Brand'}</div>
                    <div className="text-sm text-gray-600">Submitted: {new Date(s.createdAt).toLocaleString()}</div>
                    <div className="text-sm mt-2">Notes: {s.notes || '-'}</div>
                    {s.status === 'REJECTED' && <div className="mt-2 text-sm text-red-600">Rejected reason: {s.rejectionReason || 'No reason provided'}</div>}
                  </div>
                  <div className="text-sm text-gray-500">Status: {s.status}</div>
                </div>
              </div>
            ))}
            {creatorSubmissions.length === 0 && <div className="text-gray-500">No submissions</div>}
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
      await (await import('../services/submissionService')).createSubmission({ escrowId: p.escrowId, pitchId: p._id, deliverables: links.split(',').map(u => ({ type: 'link', url: u.trim() })), notes })
      add('Submission created', 'success')
      setOpen(false)
      refresh()
    } catch (e) { add('Failed to submit', 'error') }
  }
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between">
        <div>
          <div className="font-semibold">{p.brand?.name}</div>
          <div className="text-sm text-gray-600">{p.message}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{p.priceAmount} {p.priceUnit} (INR)</div>
          <div className="text-sm text-gray-500">{p.status}</div>
          {p.escrowId && <div className="mt-2"><button onClick={() => setOpen(!open)} className="px-3 py-1 bg-blue-600 text-white rounded">Submit Work</button></div>}
        </div>
      </div>
      {open && (
        <div className="mt-3">
          <input value={links} onChange={e => setLinks(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Deliverable links (comma separated)" />
          <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Notes" />
          <div className="flex justify-end">
            <button onClick={handleSubmit} className="px-3 py-1 bg-green-600 text-white rounded">Submit</button>
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
      {!open && <button onClick={() => setOpen(true)} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>}
      {open && (
        <div className="mt-2">
          <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Rejection feedback (required)" className="w-full p-2 border rounded mb-2" />
          <div className="flex gap-2">
            <button onClick={doReject} className="px-3 py-1 bg-red-600 text-white rounded">{loading ? '...' : 'Submit Rejection'}</button>
            <button onClick={() => setOpen(false)} className="px-3 py-1 border rounded">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
