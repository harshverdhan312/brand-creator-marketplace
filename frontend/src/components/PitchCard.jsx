import React from 'react'

export default function PitchCard({ creatorName, message, priceAmount, priceUnit, status, platforms, contentCount, frequency, pricePerContent, conversation }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{creatorName}</div>
          <div className="text-sm text-gray-600">{message}</div>
          <div className="text-sm text-gray-700 mt-2">Platforms: {(platforms || []).join(', ')}</div>
          <div className="text-sm text-gray-700">Content: {contentCount} items • {frequency} • {pricePerContent} INR/item</div>
          <div className="mt-2 text-sm">
            <strong>Conversation:</strong>
            <div className="text-xs text-gray-600 mt-1">
              {(conversation || []).map((c, i) => (
                <div key={i}>{c.message}</div>
              ))}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-medium">{priceAmount} {priceUnit} (INR)</div>
          <div className="text-sm text-gray-500">{status}</div>
        </div>
      </div>
    </div>
  )
}
