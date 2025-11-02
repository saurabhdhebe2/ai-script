'use client'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [quota, setQuota] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    
    if (token) {
      fetchQuota()
    }
  }, [pathname])

  const fetchQuota = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/scripts/quota`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setQuota(data)
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('email')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          ✨ AI Script Generator
        </div>
        <div className={styles.nav}>
          {isLoggedIn ? (
            <>
              <span className={styles.link} onClick={() => router.push('/generate')}>
                Generate
              </span>
              <span className={styles.link} onClick={() => router.push('/dashboard')}>
                Dashboard
              </span>
              {quota && (
                <span className={styles.quota}>
                  {quota.plan === 'premium' ? '∞' : `${quota.remaining}/${quota.total}`} left
                </span>
              )}
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <span className={styles.link} onClick={() => router.push('/auth')}>
              Login
            </span>
          )}
        </div>
      </div>
    </nav>
  )
}
