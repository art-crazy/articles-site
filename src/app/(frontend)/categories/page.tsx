import Link from 'next/link'

import { getPayloadClient } from '@/shared/api/payload'

import styles from '../topics/TopicIndex.module.css'

export const metadata = {
  title: 'Темы',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  const payload = await getPayloadClient()
  const categories = await payload.find({
    collection: 'categories',
    limit: 100,
    sort: 'title',
  })

  return (
    <section>
      <p className="eyebrow">Темы</p>
      <h1>Категории</h1>
      <p className="lead">Разделы помогают читать статьи по близким темам и возвращаться к нужным материалам.</p>
      <div className={styles.actions}>
        <Link className={styles.link} href="/tags">
          Смотреть все теги
        </Link>
      </div>
      {categories.docs.length > 0 ? (
        <div className={styles.grid}>
          {categories.docs.map((category) => (
            <Link className={styles.item} href={`/categories/${category.slug}`} key={category.id}>
              <span>{category.title}</span>
              {category.description && <small>{category.description}</small>}
            </Link>
          ))}
        </div>
      ) : (
        <div className="empty-state">Категории появятся здесь, когда автор распределит статьи по темам.</div>
      )}
    </section>
  )
}
