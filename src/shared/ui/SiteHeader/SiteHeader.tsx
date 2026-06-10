import Link from 'next/link'

import styles from './SiteHeader.module.css'

export function SiteHeader({ siteTitle }: { siteTitle: string }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          {siteTitle}
        </Link>
        <nav className={styles.nav} aria-label="Основная навигация">
          <Link href="/articles">Статьи</Link>
          <Link href="/search">Поиск</Link>
          <Link href="/about">Об авторе</Link>
          <Link href="/admin">Админка</Link>
        </nav>
      </div>
    </header>
  )
}
