'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authVersion, setAuthVersion] = useState(0)

  // Obtener usuario desde API segura (cookie-based)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me')
        if (!res.ok) throw new Error('No autenticado')
        const data = await res.json()
        setUser(data.user)
      } catch (err) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [authVersion])

  const login = (user) => {
    setUser(user)
    setAuthVersion((v) => v + 1)
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    setAuthVersion((v) => v + 1)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, authVersion }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
