import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="py-8">
          <div className="inline-flex items-center gap-2 mb-6 badge badge-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse"></span>
            OPEN MARKETPLACE
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold neon-title text-white leading-tight">
            Create.<br />
            <span className="text-neon-blue">Collaborate.</span><br />
            <span className="text-neon-green">Get Paid.</span>
          </h1>
          <p className="mt-5 text-base text-cyan-200/60 leading-relaxed max-w-md">
            A modern marketplace connecting creators with brands — secure escrows, clear workflows, and effortless collaboration.
          </p>

          <div className="mt-8 flex gap-4">
            <Link to="/register" className="btn-neon primary">Get Started</Link>
            <Link to="/login" className="btn-neon">Sign In</Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-panel p-4">
              <div className="w-8 h-8 rounded-lg bg-neon-green/10 border border-neon-green/20 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <div className="text-neon-green font-semibold text-sm">Secure Escrow</div>
              <div className="text-xs text-cyan-200/40 mt-1.5 leading-relaxed">Funds are held until work is approved.</div>
            </div>
            <div className="glass-panel p-4">
              <div className="w-8 h-8 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <div className="text-neon-pink font-semibold text-sm">Direct Messaging</div>
              <div className="text-xs text-cyan-200/40 mt-1.5 leading-relaxed">Communicate after collaborations are accepted.</div>
            </div>
            <div className="glass-panel p-4">
              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-3">
                <svg className="w-4 h-4 text-neon-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <div className="text-neon-blue font-semibold text-sm">Workflows</div>
              <div className="text-xs text-cyan-200/40 mt-1.5 leading-relaxed">Submit, review, accept or open disputes.</div>
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-center">
          <div className="relative w-full max-w-sm">
            {/* Decorative grid */}
            <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
            <div className="relative card-dark p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-5 animate-glow">
                <span className="text-neon-blue font-mono font-bold text-2xl">BC</span>
              </div>
              <div className="text-2xl font-bold text-white mb-2">BrandCreator</div>
              <div className="text-sm text-cyan-200/40 font-mono">v1.0 • marketplace</div>
              <div className="divider my-6" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-neon-blue font-mono">∞</div>
                  <div className="text-xs text-cyan-200/40 mt-1">Creators</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-neon-pink font-mono">∞</div>
                  <div className="text-xs text-cyan-200/40 mt-1">Brands</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-neon-green font-mono">₹</div>
                  <div className="text-xs text-cyan-200/40 mt-1">Escrow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
