import Link from 'next/link'

import styles from './SiteFooter.module.css'

type SiteFooterProps = {
  authorName: string
  siteTitle: string
}

export function SiteFooter({ authorName, siteTitle }: SiteFooterProps) {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <span>
          {siteTitle} / {authorName} / {new Date().getFullYear()}
        </span>
        <nav className={styles.links} aria-label="Нижняя навигация">
          <Link href="/articles">Статьи</Link>
          <Link href="/search">Поиск</Link>
          <Link href="/about">Об авторе</Link>
          <Link href="/admin">Админка</Link>
        </nav>
      </div>
    </footer>
  )
}
