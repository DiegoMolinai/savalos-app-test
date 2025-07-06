'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClipLoader } from 'react-spinners'
import { useAuth } from '@/context/AuthContext'

export default function RedirectHome() {
  const router = useRouter()
  const { token, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      router.replace(token ? '/visitas' : '/login')
    }
  }, [loading, token, router])

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      height: '50vh',
      gap: '1rem',
    }}>
      <ClipLoader size={80} color="#3498db" speedMultiplier={0.5} />
      <h1 style={{ color: '#444', fontWeight: "bold" }}>Bienvenido a Savalos SPA!</h1>
    </div>
  )
}
