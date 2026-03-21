import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { sendPitchToBrand } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'

export default function BrandCard({ brand }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [platforms, setPlatforms] = useState('')
  const [contentCount, setContentCount] = useState('')
  const [frequency, setFrequency] = useState('')
  const [pricePerContent, setPricePerContent] = useState('')
  const [contentIdea, setContentIdea] = useState('')
  const [timelineDays, setTimelineDays] = useState('')
  const { add } = useContext(NotificationContext)

  const handlePitch = async (e) => {
    e.preventDefault()
    const priceNum = Number(price)
    const ppcNum = Number(pricePerContent)
    const countNum = Number(contentCount)
    const timelineNum = timelineDays ? Number(timelineDays) : 0
    if (!message.trim()) {
      if (add) add('Pitch message is required', 'error')
      return
    }
    if (price === '' || pricePerContent === '' || contentCount === '') {
      if (add) add('All numeric fields are required', 'error')
      return
    }
    if (!Number.isFinite(priceNum) || !Number.isFinite(ppcNum) || !Number.isFinite(countNum)) {
      if (add) add('Please enter valid numeric values', 'error')
      return
    }
    if (countNum < 1) {
      if (add) add('Number of deliverables must be at least 1', 'error')
      return
    }
    if (priceNum < 0 || ppcNum < 0 || timelineNum < 0) {
      if (add) add('Values cannot be negative', 'error')
      return
    }
      try {
        await sendPitchToBrand({ 
          brandId: brand._id, 
          message, 
          priceAmount: priceNum, 
          priceUnit: 'per piece', 
          currency: 'INR',
          platforms: platforms,
          contentCount: Number(contentCount),
          frequency,
          pricePerContent: ppcNum,
          contentIdea,
          timelineDays: timelineDays ? Number(timelineDays) : undefined
        })
        if (add) add('Pitch sent to brand', 'success')
      setOpen(false)
      setMessage('')
      setPrice('')
      setPlatforms('')
      setContentCount('')
      setFrequency('')
      setPricePerContent('')
      setContentIdea('')
      setTimelineDays('')
    } catch (err) {
        const msg = err?.response?.data?.message || 'Failed to send pitch'
        if (add) add(msg, 'error')
    }
  }

  return (
    <div className="card-dark p-5">
      <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/15 flex items-center justify-center flex-shrink-0">
              <span className="text-neon-blue font-mono text-xs font-bold">{brand.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <Link to={`/profile/${brand._id}`} className="font-semibold text-white hover:text-neon-blue transition-colors truncate">{brand.name}</Link>
          </div>
          <p className="text-sm text-cyan-200/40 mt-2 line-clamp-2">{brand.bio}</p>
        </div>
        <div className="ml-3 flex-shrink-0">
          <button onClick={() => setOpen(!open)} className={`btn-action ${open ? 'btn-ghost' : 'btn-primary'}`}>
            {open ? 'Cancel' : 'Pitch'}
          </button>
        </div>
      </div>
      {open && (
        <form onSubmit={handlePitch} className="mt-4 space-y-3 border-t border-neon-blue/8 pt-4">
            <div>
              <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Pitch Message</label>
              <textarea required value={message} onChange={e => setMessage(e.target.value)} className="input-dark min-h-[70px]" placeholder="Describe your pitch..." />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Content Idea</label>
              <textarea value={contentIdea} onChange={e => setContentIdea(e.target.value)} className="input-dark min-h-[50px]" placeholder="Describe your content idea..." />
            </div>
            <div>
              <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Platforms</label>
              <input value={platforms} onChange={e => setPlatforms(e.target.value)} className="input-dark" placeholder="e.g. Instagram, YouTube" />
            </div>
            <div className="flex gap-3">
              <div className="w-1/3">
                <label htmlFor={`content-count-${brand._id}`} className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Number of Deliverables</label>
                <input id={`content-count-${brand._id}`} required type="number" min="1" className="input-dark" placeholder="e.g. 3" value={contentCount} onChange={e => setContentCount(e.target.value)} />
                <div className="text-[10px] text-cyan-200/35 mt-1">Total posts/videos/items in this campaign.</div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Frequency</label>
                <input value={frequency} onChange={e => setFrequency(e.target.value)} className="input-dark" placeholder="e.g. 2 posts/week" />
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1/3">
                <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Timeline (days)</label>
                <input type="number" min="0" className="input-dark" placeholder="e.g. 30" value={timelineDays} onChange={e => setTimelineDays(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Price per Content (INR)</label>
                <input required type="number" min="0" className="input-dark" placeholder="0" value={pricePerContent} onChange={e => setPricePerContent(e.target.value)} />
              </div>
              <div className="w-40">
                <label className="block text-xs font-mono text-cyan-200/50 mb-1 uppercase tracking-wider">Total Amount (INR)</label>
                <input required type="number" min="0" className="input-dark" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-action btn-success">Send Pitch</button>
            </div>
        </form>
      )}
    </div>
  )
}
