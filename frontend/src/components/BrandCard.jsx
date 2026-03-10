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
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex justify-between">
          <div>
          <div className="font-semibold"><Link to={`/profile/${brand._id}`}>{brand.name}</Link></div>
          <div className="text-sm text-gray-600">{brand.bio}</div>
        </div>
        <div>
          <button onClick={() => setOpen(!open)} className="px-3 py-1 bg-gray-800 text-white rounded">Pitch</button>
        </div>
      </div>
      {open && (
        <form onSubmit={handlePitch} className="mt-3 space-y-2">
            <textarea required value={message} onChange={e => setMessage(e.target.value)} className="w-full p-2 border rounded" placeholder="Pitch message" />
            <input value={platforms} onChange={e => setPlatforms(e.target.value)} className="w-full p-2 border rounded" placeholder="Platforms (comma separated) e.g. Instagram,YouTube" />
            <div className="flex gap-2">
              <input required type="number" className="p-2 border rounded w-1/3" placeholder="# of items" value={contentCount} onChange={e => setContentCount(e.target.value)} />
              <input value={frequency} onChange={e => setFrequency(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Frequency e.g. 2 posts/week" />
            </div>
            <div className="flex gap-2">
              <input required type="number" className="flex-1 p-2 border rounded" placeholder="Price per content (INR)" value={pricePerContent} onChange={e => setPricePerContent(e.target.value)} />
              <input required type="number" className="w-40 p-2 border rounded" placeholder="Total amount" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div className="flex justify-end">
              <button className="px-3 py-1 bg-green-600 text-white rounded">Send</button>
            </div>
        </form>
      )}
    </div>
  )
}
