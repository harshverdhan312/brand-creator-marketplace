import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { sendPitchToBrand } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'

export default function BrandCard({ brand }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('per piece')
  const [platforms, setPlatforms] = useState('')
  const [contentCount, setContentCount] = useState('')
  const [frequency, setFrequency] = useState('')
  const [pricePerContent, setPricePerContent] = useState('')
  const { add } = useContext(NotificationContext)

  const handlePitch = async (e) => {
    e.preventDefault()
      try {
        await sendPitchToBrand({ 
          brandId: brand._id, 
          message, 
          priceAmount: Number(price), 
          priceUnit: unit, 
          currency: 'INR',
          platforms: platforms,
          contentCount: Number(contentCount),
          frequency,
          pricePerContent: Number(pricePerContent)
        })
        if (add) add('Pitch sent to brand', 'success')
      setOpen(false)
      setMessage('')
      setPrice('')
      setPlatforms('')
      setContentCount('')
      setFrequency('')
      setPricePerContent('')
    } catch (err) {
        if (add) add('Failed to send pitch', 'error')
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
            <textarea required value={message} onChange={e => setMessage(e.target.value)} className="input-dark min-h-[70px]" placeholder="Pitch message" />
            <input value={platforms} onChange={e => setPlatforms(e.target.value)} className="input-dark" placeholder="Platforms (comma separated) e.g. Instagram,YouTube" />
            <div className="flex gap-3">
              <input required type="number" className="input-dark w-1/3" placeholder="# of items" value={contentCount} onChange={e => setContentCount(e.target.value)} />
              <input value={frequency} onChange={e => setFrequency(e.target.value)} className="input-dark flex-1" placeholder="Frequency e.g. 2 posts/week" />
            </div>
            <div className="flex gap-3">
              <input required type="number" className="input-dark flex-1" placeholder="Price per content (INR)" value={pricePerContent} onChange={e => setPricePerContent(e.target.value)} />
              <input required type="number" className="input-dark w-40" placeholder="Total amount" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button type="submit" className="btn-action btn-success">Send Pitch</button>
            </div>
        </form>
      )}
    </div>
  )
}
