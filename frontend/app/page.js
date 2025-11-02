'use client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter()

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.hero}>
          <h1 className={styles.title}>AI Script Generator</h1>
          <p className={styles.subtitle}>
            Create professional YouTube scripts in seconds with AI
          </p>
        </div>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>⚡ Lightning Fast</h3>
            <p>Generate scripts in seconds using advanced AI models</p>
          </div>
          <div className={styles.feature}>
            <h3>🎯 Customizable</h3>
            <p>Choose tone, style, and target audience</p>
          </div>
          <div className={styles.feature}>
            <h3>📊 Freemium</h3>
            <p>3 free scripts daily, unlimited with premium</p>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={() => router.push('/generate')}>
            Start Generating
          </button>
          <button 
            className={styles.secondaryBtn}
            onClick={() => router.push('/auth')}
          >
            Login / Register
          </button>
        </div>
      </div>
    </>
  )
}
