import React from 'react'

export default function PitchCard({ creatorName, message, priceAmount, priceUnit, status }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{creatorName}</div>
          <div className="text-sm text-gray-600">{message}</div>
        </div>
        <div className="text-right">
          <div className="font-medium">{priceAmount} {priceUnit} (INR)</div>
          <div className="text-sm text-gray-500">{status}</div>
        </div>
      </div>
    </div>
  )
}
