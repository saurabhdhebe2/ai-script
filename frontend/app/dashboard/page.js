'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import ScriptCard from '@/components/ScriptCard'
import { callApi } from '@/lib/api'
import styles from './Dashboard.module.css'

export default function DashboardPage() {
  const router = useRouter()
  const [scripts, setScripts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
      return
    }
    
    fetchScripts()
  }, [router])

  const fetchScripts = async () => {
    try {
      const data = await callApi('getScripts', 'GET')
      setScripts(data)
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
        <div className={styles.header}>
          <h1 className={styles.title}>My Scripts</h1>
          <button 
            className={styles.newBtn}
            onClick={() => router.push('/generate')}
          >
            + New Script
          </button>
        </div>

        {loading && <div className={styles.loading}>Loading your scripts...</div>}

        {error && <div className={styles.error}>{error}</div>}

        {!loading && !error && scripts.length === 0 && (
          <div className={styles.empty}>
            <h2>No scripts yet</h2>
            <p>Create your first AI-generated YouTube script!</p>
            <button onClick={() => router.push('/generate')}>
              Get Started
            </button>
          </div>
        )}

        {!loading && !error && scripts.length > 0 && (
          <div className={styles.grid}>
            {scripts.map((item) => (
              <ScriptCard
                key={item.id}
                script={item.script}
                topic={item.topic}
                createdAt={item.created_at}
              />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
