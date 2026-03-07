import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { sendPitchToBrand } from '../services/pitchService'
import { NotificationContext } from '../context/NotificationContext'

export default function BrandCard({ brand }) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [price, setPrice] = useState('')
  const [unit, setUnit] = useState('per piece')
  const { add } = useContext(NotificationContext)

  const handlePitch = async (e) => {
    e.preventDefault()
      try {
        await sendPitchToBrand({ brandId: brand._id, message, priceAmount: Number(price), priceUnit: unit, currency: 'INR' })
        if (add) add('Pitch sent to brand', 'success')
      setOpen(false)
      setMessage('')
      setPrice('')
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
          <div className="flex gap-2">
            <input required type="number" className="flex-1 p-2 border rounded" placeholder="Amount (INR) e.g. 1000" value={price} onChange={e => setPrice(e.target.value)} />
            <input value={unit} onChange={e => setUnit(e.target.value)} className="w-40 p-2 border rounded" placeholder="Unit e.g. per post" />
          </div>
          <div className="flex justify-end">
            <button className="px-3 py-1 bg-green-600 text-white rounded">Send</button>
          </div>
        </form>
      )}
    </div>
  )
}
