'use client'

import { useState } from 'react'

import styles from './ShareArticleButton.module.css'

export function ShareArticleButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  async function copyLink() {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className={styles.button} onClick={copyLink} type="button">
      {copied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
    </button>
  )
}
