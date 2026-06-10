import Image from 'next/image'
import Link from 'next/link'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { RichText } from '@/entities/article/ui/RichText/RichText'
import { getPayloadClient } from '@/shared/api/payload'
import { getSiteSettings } from '@/shared/api/siteSettings'
import {
  formatDate,
  getMediaAlt,
  getMediaUrl,
  getRelationId,
  getRelationSlug,
  getRelationTitle,
} from '@/shared/lib/format'

export const revalidate = 60
export const dynamic = 'force-dynamic'

type ArticlePageProps = {
  params: Promise<{
    slug: string
  }>
}

async function getArticle(slug: string) {
  const { isEnabled } = await draftMode()
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'articles',
    depth: 2,
    draft: isEnabled,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const article = result.docs[0] || null

  if (!article || (!isEnabled && article._status !== 'published')) {
    return null
  }

  return article
}

async function getRelatedArticles(article: NonNullable<Awaited<ReturnType<typeof getArticle>>>) {
  const payload = await getPayloadClient()
  const categoryId = getRelationId(article.category)
  const tagIds = Array.isArray(article.tags)
    ? article.tags.map(getRelationId).filter((id): id is string | number => id !== null)
    : []

  if (!categoryId && tagIds.length === 0) {
    return []
  }

  const result = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 8,
    sort: '-publishedAt',
    where: {
      and: [
        {
          _status: {
            equals: 'published',
          },
        },
        {
          or: [
            ...(categoryId
              ? [
                  {
                    category: {
                      equals: categoryId,
                    },
                  },
                ]
              : []),
            ...tagIds.map((tagId) => ({
              tags: {
                contains: tagId,
              },
            })),
          ],
        },
      ],
    },
  })

  return result.docs.filter((relatedArticle) => relatedArticle.id !== article.id).slice(0, 3)
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

  const image = getMediaUrl(article.seo?.ogImage || article.coverImage)
  const defaultImage = getMediaUrl(settings.defaultOgImage)

  return {
    description: article.seo?.description || article.excerpt,
    openGraph: {
      description: article.seo?.description || article.excerpt,
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
    <article className="article-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {article._status === 'draft' && (
        <a className="preview-banner" href="/preview/exit">
          Черновик. Выйти из preview
        </a>
      )}
      <div className="article-meta">
        <span>{formatDate(article.publishedAt)}</span>
        {categoryTitle && categorySlug && (
          <>
            <span aria-hidden="true"> / </span>
            <Link href={`/categories/${categorySlug}`}>{categoryTitle}</Link>
          </>
        )}
      </div>
      <h1>{article.title}</h1>
      {article.subtitle && <p className="article-subtitle">{article.subtitle}</p>}
      {article.excerpt && <p className="lead">{article.excerpt}</p>}
      {tags.length > 0 && (
        <div className="tag-list article-page__tags">
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
          className="article-page__cover"
          height={720}
          priority
          src={imageUrl}
          width={1280}
        />
      )}
      <RichText data={article.content} />
      {relatedArticles.length > 0 && (
        <section className="related-section">
          <p className="eyebrow">Еще по этой теме</p>
          <div className="related-list">
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
