import React, { useEffect, useState, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
// campaigns removed; showing brands/creators only
import { AuthContext } from '../context/AuthContext'
import { getBrands, getCreators } from '../services/userService'
import BrandCard from '../components/BrandCard'
import CreatorCard from '../components/CreatorCard'
import Landing from './Landing'

export default function Home() {
  const [campaigns, setCampaigns] = useState([])
  const [brands, setBrands] = useState([])
  const [creators, setCreators] = useState([])
  const [searchParams] = useSearchParams()

  const { user } = useContext(AuthContext)

  useEffect(() => {
    // campaigns removed; no default list

    // if logged in, show role-specific lists on home
    if (user && user.role === 'creator') {
      getBrands().then(r => setBrands(r.data)).catch(() => {})
    }
    if (user && user.role === 'brand') {
      getCreators().then(r => setCreators(r.data)).catch(() => {})
    }
  }, [user])

  if (!user) return <Landing />

  return (
    <div>
      <section className="py-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 rounded-full bg-neon-blue" />
          <h1 className="text-3xl font-bold text-white tracking-tight">Marketplace</h1>
        </div>
        {user.role === 'creator' ? (
          <p className="text-cyan-200/50 max-w-xl">Discover exciting brand campaigns and connect with top brands to showcase your creativity.</p>
        ) : (
          <p className="text-cyan-200/50 max-w-xl">Find talented creators to bring your brand campaigns to life and reach new audiences.</p>
        )}
      </section>

      {/* Campaigns removed from UI */}

      {user && user.role === 'creator' && (
        <section className="mt-4">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="section-title">Brands</h3>
            <span className="badge badge-cyan">{brands.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brands.map(b => <BrandCard key={b._id} brand={b} />)}
          </div>
        </section>
      )}

      {user && user.role === 'brand' && (
        <section className="mt-4">
          <div className="flex items-center gap-2 mb-5">
            <h3 className="section-title">Creators</h3>
            <span className="badge badge-pink">{creators.length}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map(c => <CreatorCard key={c._id} creator={c} />)}
          </div>
          {searchParams.get('connectCreatorId') && (
            <div className="mt-6 p-3 rounded-lg border border-neon-blue/20 bg-neon-blue/5 text-xs text-cyan-200/60">
              Open the creator profile and use the pitch flow to connect. Messaging unlocks after pitch acceptance.
            </div>
          )}
        </section>
      )}
    </div>
  )
}
