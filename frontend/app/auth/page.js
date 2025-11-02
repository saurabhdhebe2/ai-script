'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import styles from './Auth.module.css'

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isLogin ? 'login' : 'register'
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.detail || 'Authentication failed')
      }

      localStorage.setItem('token', data.token)
      localStorage.setItem('email', data.email)
      router.push('/generate')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${isLogin ? styles.activeTab : ''}`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`${styles.tab} ${!isLogin ? styles.activeTab : ''}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          <h1 className={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                placeholder="••••••••"
              />
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
