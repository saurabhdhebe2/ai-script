'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { callApi } from '@/lib/api'
import styles from './Generate.module.css'

export default function GeneratePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    topic: '',
    tone: 'professional',
    style: 'informative',
    audience: 'general'
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/auth')
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setResult(null)

    try {
      const data = await callApi('generateScript', 'POST', formData)
      setResult(data)
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
          <h1 className={styles.title}>Generate YouTube Script</h1>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Topic *</label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., AI in Education"
                maxLength={100}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>Tone</label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="serious">Serious</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              <div className={styles.inputGroup}>
                <label>Style</label>
                <select
                  value={formData.style}
                  onChange={(e) => setFormData({ ...formData, style: e.target.value })}
                >
                  <option value="informative">Informative</option>
                  <option value="narrative">Narrative</option>
                  <option value="tutorial">Tutorial</option>
                  <option value="educational">Educational</option>
                  <option value="entertaining">Entertaining</option>
                </select>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Target Audience</label>
              <input
                type="text"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                placeholder="e.g., teachers, students, professionals"
              />
            </div>

            <button 
              type="submit" 
              className={styles.generateBtn}
              disabled={loading}
            >
              {loading ? '✨ Generating...' : '✨ Generate Script'}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {loading && <div className={styles.loading}>Generating your script...</div>}

        {result && result.script && (
          <div className={styles.result}>
            <h2 className={styles.resultTitle}>{result.script.title}</h2>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Introduction</div>
              <div className={styles.sectionContent}>{result.script.intro}</div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Main Content</div>
              <div className={styles.sectionContent}>{result.script.body}</div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionLabel}>Conclusion</div>
              <div className={styles.sectionContent}>{result.script.outro}</div>
            </div>

            {result.quota && (
              <div style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
                {result.quota.plan === 'premium' 
                  ? '✨ Premium: Unlimited scripts'
                  : `${result.quota.remaining}/${result.quota.total} free scripts remaining today`
                }
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
