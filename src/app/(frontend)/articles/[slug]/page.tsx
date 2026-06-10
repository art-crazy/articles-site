import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RichText } from '@/entities/article/ui/RichText/RichText'
import { ShareArticleButton } from '@/features/shareArticle/ui/ShareArticleButton/ShareArticleButton'
import { getSiteSettings } from '@/shared/api/siteSettings'
import {
  formatDate,
  getMediaAlt,
  getMediaUrl,
  getRelationSlug,
  getRelationTitle,
} from '@/shared/lib/format'

import { getAdjacentArticles, getArticle, getRelatedArticles } from './articleQueries'
import styles from './ArticlePage.module.css'

export const revalidate = 60
export const dynamic = 'force-dynamic'

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)
  const settings = await getSiteSettings()

  if (!article) {
    return {
      title: 'Статья не найдена',
    }
  }

  const image = getMediaUrl(article.seo?.ogImage || article.coverImage || settings.defaultOgImage)
  const defaultImage = getMediaUrl(settings.defaultOgImage)
  const description = article.seo?.description || article.excerpt || settings.siteDescription

  return {
    description,
    openGraph: {
      description,
      images: image || defaultImage ? [image || defaultImage || ''] : [],
      title: article.seo?.title || article.title,
      type: 'article',
    },
    title: article.seo?.title || article.title,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const article = await getArticle(slug)

  if (!article) {
    notFound()
  }

  const imageUrl = getMediaUrl(article.coverImage)
  const categoryTitle = getRelationTitle(article.category)
  const categorySlug = getRelationSlug(article.category)
  const tags = Array.isArray(article.tags) ? article.tags : []
  const settings = await getSiteSettings()
  const relatedArticles = await getRelatedArticles(article)
  const adjacentArticles = await getAdjacentArticles(article)
  const authorPhotoUrl = getMediaUrl(settings.authorPhoto)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '')
  const articleUrl = `${siteUrl}/articles/${article.slug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    author: {
      '@type': 'Person',
      name: settings.authorName,
    },
    dateModified: article.updatedAt,
    datePublished: article.publishedAt || article.createdAt,
    description: article.seo?.description || article.excerpt,
    headline: article.seo?.title || article.title,
    image: imageUrl ? [imageUrl] : undefined,
  }

  return (
    <article className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {article._status === 'draft' && (
        <a className={styles.previewBanner} href="/preview/exit">
          Открыт предпросмотр черновика. Выйти из предпросмотра
        </a>
      )}
      <div className={styles.meta}>
        <span>{formatDate(article.publishedAt)}</span>
        {categoryTitle && categorySlug && (
          <>
            <span aria-hidden="true"> / </span>
            <Link href={`/categories/${categorySlug}`}>{categoryTitle}</Link>
          </>
        )}
      </div>
      <h1>{article.title}</h1>
      {article.subtitle && <p className={styles.subtitle}>{article.subtitle}</p>}
      {article.excerpt && <p className="lead">{article.excerpt}</p>}
      {tags.length > 0 && (
        <div className={`${styles.tagList} ${styles.tags}`}>
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
      {imageUrl && (
        <Image
          alt={getMediaAlt(article.coverImage)}
          className={styles.cover}
          height={720}
          priority
          src={imageUrl}
          width={1280}
        />
      )}
      <RichText data={article.content} />
      <section className={styles.afterword}>
        <div className={`${styles.authorBox} ${authorPhotoUrl ? styles.authorBoxWithPhoto : ''}`}>
          {authorPhotoUrl && (
            <Image
              alt={getMediaAlt(settings.authorPhoto) || settings.authorName}
              className={styles.authorPhoto}
              height={144}
              src={authorPhotoUrl}
              width={144}
            />
          )}
          <div>
            <p className="eyebrow">Автор</p>
            <h2>{settings.authorName}</h2>
            {settings.authorBio && <p>{settings.authorBio}</p>}
            <Link className={styles.authorLink} href="/about">
              Подробнее об авторе
            </Link>
          </div>
        </div>
        <div className={styles.shareBox}>
          <h2>Поделиться статьей</h2>
          <p>Скопируйте ссылку и отправьте ее в сообщении или соцсетях.</p>
          <a className={styles.shareLink} href={articleUrl}>
            {articleUrl}
          </a>
          <div>
            <ShareArticleButton url={articleUrl} />
          </div>
        </div>
      </section>
      {(adjacentArticles.previous || adjacentArticles.next) && (
        <nav className={styles.articleNav} aria-label="Навигация по статьям">
          {adjacentArticles.previous ? (
            <Link href={`/articles/${adjacentArticles.previous.slug}`}>
              <span>Предыдущая статья</span>
              <strong>{adjacentArticles.previous.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {adjacentArticles.next && (
            <Link href={`/articles/${adjacentArticles.next.slug}`}>
              <span>Следующая статья</span>
              <strong>{adjacentArticles.next.title}</strong>
            </Link>
          )}
        </nav>
      )}
      {relatedArticles.length > 0 && (
        <section className={styles.related}>
          <p className="eyebrow">Еще по этой теме</p>
          <div className={styles.relatedList}>
            {relatedArticles.map((relatedArticle) => (
              <Link href={`/articles/${relatedArticle.slug}`} key={relatedArticle.id}>
                <span>{formatDate(relatedArticle.publishedAt)}</span>
                <strong>{relatedArticle.title}</strong>
                {relatedArticle.excerpt && <small>{relatedArticle.excerpt}</small>}
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}
