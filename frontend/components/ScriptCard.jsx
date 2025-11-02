'use client'
import { useState } from 'react'
import styles from './ScriptCard.module.css'

export default function ScriptCard({ script, topic, createdAt }) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.topic}>{topic}</div>
        <div className={styles.date}>{formatDate(createdAt)}</div>
      </div>

      <div className={styles.title}>{script.title}</div>

      <div className={styles.section}>
        <div className={styles.sectionLabel}>Intro</div>
        <div className={expanded ? '' : styles.content}>
          {script.intro}
        </div>
      </div>

      {expanded && (
        <>
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Body</div>
            <div className={styles.content} style={{ WebkitLineClamp: 'unset' }}>
              {script.body}
            </div>
          </div>

          <div className={styles.section}>
            <div className={styles.sectionLabel}>Outro</div>
            <div className={styles.content} style={{ WebkitLineClamp: 'unset' }}>
              {script.outro}
            </div>
          </div>
        </>
      )}

      <button 
        className={styles.expandBtn}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  )
}
