import React, { createContext, useState, useCallback } from 'react'

export const NotificationContext = createContext(null)

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
          <div key={n.id} className={`max-w-sm p-3 rounded shadow ${n.type === 'error' ? 'bg-red-100 text-red-800' : n.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {n.message}
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  )
}
