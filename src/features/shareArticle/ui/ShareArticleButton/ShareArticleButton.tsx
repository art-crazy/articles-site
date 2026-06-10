'use client'

import { useState } from 'react'

import styles from './ShareArticleButton.module.css'

export function ShareArticleButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  async function shareLink() {
    if (!canShare) {
      return
    }

    await navigator.share({ url })
  }

  return (
    <div className={styles.group}>
      <button className={styles.button} onClick={copyLink} type="button">
        {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
      </button>
      {canShare && (
        <button className={styles.button} onClick={shareLink} type="button">
          Поделиться
        </button>
      )}
    </div>
  )
}
