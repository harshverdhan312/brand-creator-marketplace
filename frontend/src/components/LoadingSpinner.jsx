import React from 'react'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
    </div>
  )
}
