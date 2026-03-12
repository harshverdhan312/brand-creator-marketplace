import React from 'react'

function statusBadgeClass(status) {
  if (!status) return 'badge-cyan'
  if (status.includes('ACCEPTED') || status.includes('APPROVED') || status.includes('COMPLETED')) return 'badge-green'
  if (status.includes('REJECTED')) return 'badge-red'
  if (status.includes('DISPUTED')) return 'badge-pink'
  if (status.includes('SUBMITTED') || status.includes('PENDING')) return 'badge-amber'
  return 'badge-cyan'
}

export default function PitchCard({ creatorName, message, priceAmount, priceUnit, status, platforms, contentCount, frequency, pricePerContent, conversation }) {
  return (
    <div className="card-dark p-5">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white">{creatorName}</div>
          <p className="text-sm text-cyan-200/50 mt-1">{message}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-cyan-200/40">
            <span>Platforms: {(platforms || []).join(', ')}</span>
            <span>{contentCount} items • {frequency} • ₹{pricePerContent}/item</span>
          </div>
          {(conversation || []).length > 0 && (
            <div className="mt-3 p-3 rounded-lg bg-surface/50 border border-border-dim">
              <div className="text-xs font-mono text-cyan-200/50 mb-1.5 uppercase tracking-wider">Conversation</div>
              <div className="space-y-1">
                {(conversation || []).map((c, i) => (
                  <div key={i} className="text-xs text-cyan-200/40">{c.message}</div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-mono font-semibold text-white">₹{priceAmount}</div>
          <div className="text-xs text-cyan-200/40">{priceUnit}</div>
          <span className={`badge ${statusBadgeClass(status)} mt-2`}>{status}</span>
        </div>
      </div>
    </div>
  )
}
