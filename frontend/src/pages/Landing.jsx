import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold">Welcome to Brand–Creator Marketplace</h1>
      <p className="mt-4 text-gray-600">Connect with brands, find campaigns, and collaborate.</p>
      <div className="mt-6 flex justify-center gap-4">
        <Link to="/register" className="px-6 py-3 bg-blue-600 text-white rounded">Get Started</Link>
        <Link to="/login" className="px-6 py-3 border rounded">Sign In</Link>
      </div>
      <section className="mt-12 max-w-2xl mx-auto text-left">
        <h3 className="text-2xl font-semibold">How it works</h3>
        <ul className="list-disc ml-6 mt-3 text-gray-700">
          <li>Brands create campaigns and invite creators.</li>
          <li>Creators pitch to brands or request campaigns.</li>
          <li>Escrow ensures secure payments on completion.</li>
        </ul>
      </section>
    </div>
  )
}
