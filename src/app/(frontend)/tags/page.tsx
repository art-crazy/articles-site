import Link from 'next/link'

import { getPayloadClient } from '@/shared/api/payload'

import styles from '../topics/TopicIndex.module.css'

export const metadata = {
  title: 'Теги',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function TagsPage() {
  const payload = await getPayloadClient()
  const tags = await payload.find({
    collection: 'tags',
    limit: 150,
    sort: 'title',
  })

  return (
    <section>
      <p className="eyebrow">Темы</p>
      <h1>Теги</h1>
      <p className="lead">Теги собирают статьи по деталям, людям, местам и повторяющимся мотивам.</p>
      <div className={styles.actions}>
        <Link className={styles.link} href="/categories">
          Смотреть категории
        </Link>
      </div>
      {tags.docs.length > 0 ? (
        <div className={styles.grid}>
          {tags.docs.map((tag) => (
            <Link className={styles.item} href={`/tags/${tag.slug}`} key={tag.id}>
              <span>{tag.title}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">Теги появятся здесь, когда у статей будут дополнительные темы.</div>
      )}
    </section>
  )
}
