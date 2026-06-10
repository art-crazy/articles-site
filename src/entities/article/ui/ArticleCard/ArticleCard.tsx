import Image from 'next/image'
import Link from 'next/link'

import {
  formatDate,
  getMediaAlt,
  getMediaUrl,
  getRelationSlug,
  getRelationTitle,
} from '@/shared/lib/format'

import styles from './ArticleCard.module.css'

type ArticleCardProps = {
  article: {
    category?: unknown
    coverImage?: unknown
    excerpt?: string | null
    publishedAt?: string | null
    readingTime?: number | null
    slug?: string | null
    tags?: unknown[] | null
    title?: string | null
  }
}

export function ArticleCard({ article }: ArticleCardProps) {
  const imageUrl = getMediaUrl(article.coverImage)
  const href = `/articles/${article.slug}`
  const categoryTitle = getRelationTitle(article.category)
  const categorySlug = getRelationSlug(article.category)
  const tags = Array.isArray(article.tags) ? article.tags : []

  return (
    <article className={styles.card}>
      {imageUrl && (
        <Image
          alt={getMediaAlt(article.coverImage)}
          className={styles.cover}
          height={520}
          src={imageUrl}
          width={832}
        />
      )}
      <div className={styles.meta}>
        <span>{formatDate(article.publishedAt)}</span>
        {article.readingTime && (
          <>
            <span aria-hidden="true"> / </span>
            <span>{article.readingTime} мин чтения</span>
          </>
        )}
        {categoryTitle && categorySlug && (
          <>
            <span aria-hidden="true"> / </span>
            <Link href={`/categories/${categorySlug}`}>{categoryTitle}</Link>
          </>
        )}
      </div>
      <h3 className={styles.title}>
        <Link href={href}>{article.title}</Link>
      </h3>
      {article.excerpt && <p className={styles.excerpt}>{article.excerpt}</p>}
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag) => {
            const slug = getRelationSlug(tag)
            const title = getRelationTitle(tag)

            if (!slug || !title) {
              return null
            }

            return (
              <Link href={`/tags/${slug}`} key={slug}>
                {title}
              </Link>
            )
          })}
        </div>
      )}
    </article>
  )
}
