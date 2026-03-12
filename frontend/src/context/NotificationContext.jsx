import React, { createContext, useState, useCallback } from 'react'

export const NotificationContext = createContext(null)

const toastStyles = {
  error: 'border-red-500/30 bg-red-500/10 text-red-300',
  success: 'border-neon-green/30 bg-neon-green/10 text-neon-green',
  info: 'border-neon-blue/30 bg-neon-blue/10 text-neon-blue',
}

const toastIcons = {
  error: '✕',
  success: '✓',
  info: 'ℹ',
}

export const NotificationProvider = ({ children }) => {
  const [notes, setNotes] = useState([])
  const add = useCallback((message, type = 'info') => {
    const id = Date.now().toString()
    setNotes(n => [...n, { id, message, type }])
    // auto remove
    setTimeout(() => setNotes(n => n.filter(x => x.id !== id)), 6000)
  }, [])
  const remove = (id) => setNotes(n => n.filter(x => x.id !== id))
  return (
    <NotificationContext.Provider value={{ notes, add, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {notes.map(n => (
          <div
            key={n.id}
            className={`max-w-sm px-4 py-3 rounded-lg border backdrop-blur-md text-sm font-medium flex items-center gap-2.5 shadow-lg animate-[slideIn_0.2s_ease-out] ${toastStyles[n.type] || toastStyles.info}`}
          >
            <span className="font-mono text-xs">{toastIcons[n.type] || toastIcons.info}</span>
            {n.message}
            <button onClick={() => remove(n.id)} aria-label="Close notification" className="ml-auto opacity-50 hover:opacity-100 transition-opacity text-xs">✕</button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
