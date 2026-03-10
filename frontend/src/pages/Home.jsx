import React, { useEffect, useState, useContext } from 'react'
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
      <section className="py-10">
        <h1 className="text-3xl font-bold">Brand–Creator Collaboration Marketplace</h1>
        {user.role === 'creator' ? (
          <p className="mt-4 text-lg">Discover exciting brand campaigns and connect with top brands to showcase your creativity.</p>
        ) : (
          <p className="mt-4 text-lg">Find talented creators to bring your brand campaigns to life and reach new audiences.</p>
        )}
        
      </section>

      {/* Campaigns removed from UI */}

      {user && user.role === 'creator' && (
        
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Brands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {brands.map(b => <BrandCard key={b._id} brand={b} />)}
          </div>
        </section>
      )}

      {user && user.role === 'brand' && (
        <section className="mt-8">
          <h3 className="text-xl font-semibold mb-4">Creators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map(c => <CreatorCard key={c._id} creator={c} />)}
          </div>
        </section>
      )}
    </div>
  )
}
