// src/layout/Header.jsx
'use client'

import Link from "next/link"
import { FaRegListAlt } from "react-icons/fa"
import { useAuth } from "@/context/AuthContext"
import styles from "@/styles/layout/Header.module.css"

export default function Header() {
  const { token, loading, logout } = useAuth()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <FaRegListAlt className={styles.logoIcon} />
          <span className={styles.logoText}>Savalos SPA</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>Inicio</Link>
          <Link href="/items" className={styles.link}>Items</Link>
          <Link href="/visitas" className={styles.link}>Visitas</Link>
        </nav>

        <div className={styles.actions}>
          {!loading && token && (
            <button onClick={handleLogout} className={styles.userButton}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
