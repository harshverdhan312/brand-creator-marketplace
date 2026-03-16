import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { NotificationContext } from '../context/NotificationContext'
import { adminListUsers, adminListDisputes, adminResolveDispute } from '../services/adminService'

function statusBadgeClass(status) {
  if (!status) return 'badge-cyan'
  if (status === 'RESOLVED') return 'badge-green'
  if (status === 'OPEN') return 'badge-pink'
  return 'badge-cyan'
}

export default function AdminPanel() {
  const { user } = useContext(AuthContext)
  const { add } = useContext(NotificationContext)
  const [users, setUsers] = useState([])
  const [disputes, setDisputes] = useState([])
  const [tab, setTab] = useState('users')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [uRes, dRes] = await Promise.all([
          adminListUsers(),
          adminListDisputes()
        ])
        setUsers(uRes.data)
        setDisputes(dRes.data)
      } catch (e) {
        add('Failed to load admin data', 'error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [add])

  const handleResolve = async (disputeId, resolution) => {
    try {
      await adminResolveDispute(disputeId, resolution)
      add(`Dispute resolved: ${resolution}`, 'success')
      const dRes = await adminListDisputes()
      setDisputes(dRes.data)
    } catch (e) {
      add('Failed to resolve dispute', 'error')
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto card-dark p-8 text-center">
        <p className="text-red-400">Access denied. Admin role required.</p>
      </div>
    )
  }

  if (loading) return <div className="flex items-center justify-center p-12 text-cyan-200/40">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 rounded-full bg-neon-pink" />
        <h2 className="text-2xl font-bold text-white tracking-tight">Admin Panel</h2>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab('users')} className={`btn-action ${tab === 'users' ? 'btn-primary' : 'btn-ghost'}`}>
          Users ({users.length})
        </button>
        <button onClick={() => setTab('disputes')} className={`btn-action ${tab === 'disputes' ? 'btn-primary' : 'btn-ghost'}`}>
          Disputes ({disputes.length})
        </button>
      </div>

      {tab === 'users' && (
        <div className="space-y-2">
          {users.map(u => (
            <div key={u._id} className="card-dark p-4 flex items-center gap-4">
              <div className="w-9 h-9 rounded-lg bg-neon-blue/10 border border-neon-blue/15 flex items-center justify-center flex-shrink-0">
                <span className="text-neon-blue font-mono text-xs font-bold">{u.name?.charAt(0)?.toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-white">{u.name}</div>
                <div className="text-xs text-cyan-200/40 font-mono">{u.email}</div>
              </div>
              <span className={`badge ${u.role === 'admin' ? 'badge-pink' : u.role === 'brand' ? 'badge-cyan' : 'badge-green'}`}>
                {u.role}
              </span>
              <div className="text-xs text-cyan-200/30 font-mono">₹{u.balance || 0}</div>
            </div>
          ))}
          {users.length === 0 && <div className="text-cyan-200/40 text-sm text-center py-8">No users found.</div>}
        </div>
      )}

      {tab === 'disputes' && (
        <div className="space-y-3">
          {disputes.map(d => (
            <div key={d._id} className="card-dark p-5">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${statusBadgeClass(d.status)}`}>{d.status}</span>
                    {d.resolution && d.resolution !== 'NONE' && (
                      <span className="badge badge-amber">{d.resolution}</span>
                    )}
                  </div>
                  <div className="text-sm text-cyan-200/50">Reason: {d.reason || 'N/A'}</div>
                  <div className="mt-2 flex gap-4 text-xs font-mono text-cyan-200/35">
                    <span>Creator: {d.creatorId?.name || d.creatorId}</span>
                    <span>Brand: {d.brandId?.name || d.brandId}</span>
                  </div>
                  <div className="text-xs text-cyan-200/30 mt-1 font-mono">
                    {new Date(d.createdAt).toLocaleString()}
                  </div>
                </div>
                {d.status === 'OPEN' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleResolve(d._id, 'CREATOR')} className="btn-action btn-success text-xs">
                      Pay Creator
                    </button>
                    <button onClick={() => handleResolve(d._id, 'UNRESOLVED')} className="btn-action btn-danger text-xs">
                      Split (30/70)
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {disputes.length === 0 && <div className="text-cyan-200/40 text-sm text-center py-8">No disputes found.</div>}
        </div>
      )}
    </div>
  )
}
