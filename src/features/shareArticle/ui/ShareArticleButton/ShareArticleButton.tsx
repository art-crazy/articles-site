'use client'

import { useEffect, useState } from 'react'

import styles from './ShareArticleButton.module.css'

export function ShareArticleButton({ url }: { url: string }) {
  const [canShare, setCanShare] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setCanShare('share' in navigator), 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  async function copyLink() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }

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
