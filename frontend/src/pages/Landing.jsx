import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="p-8">
          <h1 className="text-5xl md:text-6xl font-extrabold neon-title text-neon-blue">Create. Collaborate. Get Paid.</h1>
          <p className="mt-4 text-lg text-cyan-100">A modern marketplace connecting creators with brands — secure escrows, clear workflows, and effortless collaboration.</p>

          <div className="mt-6 flex gap-4">
            <Link to="/register" className="btn-neon primary">Get Started</Link>
            <Link to="/login" className="btn-neon">Sign In</Link>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-3 text-sm">
              <div className="text-neon-green font-semibold">Secure Escrow</div>
              <div className="text-xs text-cyan-100 mt-2">Funds are held until work is approved.</div>
            </div>
            <div className="glass-panel p-3 text-sm">
              <div className="text-neon-pink font-semibold">Direct Messaging</div>
              <div className="text-xs text-cyan-100 mt-2">Communicate after collaborations are accepted.</div>
            </div>
            <div className="glass-panel p-3 text-sm">
              <div className="text-neon-blue font-semibold">Workflows</div>
              <div className="text-xs text-cyan-100 mt-2">Submit, review, accept or open disputes.</div>
            </div>
          </div>
        </div>

        <div className="p-8 hidden md:block">
          <div className="w-full h-80 rounded-lg relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(0,229,255,0.06), rgba(255,77,255,0.04))'}}>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 400" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" x2="1">
                  <stop offset="0%" stopColor="#00e5ff" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#ff4dff" stopOpacity="0.06" />
                </linearGradient>
              </defs>
              <rect width="600" height="400" fill="url(#g1)" />
              <g strokeWidth="1" strokeOpacity="0.07" stroke="#00e5ff">
                <path d="M0,100 C150,200 450,0 600,100 L600,400 L0,400 Z" fill="none" />
                <path d="M0,200 C200,100 400,300 600,200" fill="none" />
              </g>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/90">
                <div className="text-3xl font-semibold">BrandCreator</div>
                <div className="text-sm mt-2 text-cyan-100">A neon workspace for modern collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
