import Link from 'next/link'
import Image from 'next/image'

import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { SearchForm } from '@/features/articleSearch/ui/SearchForm/SearchForm'
import { getPayloadClient } from '@/shared/api/payload'
import { getSiteSettings } from '@/shared/api/siteSettings'
import { getMediaAlt, getMediaUrl } from '@/shared/lib/format'

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const settings = await getSiteSettings()
  const [featuredArticles, latestArticles, categories] = await Promise.all([
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 1,
      sort: '-publishedAt',
      where: {
        and: [
          {
            _status: {
              equals: 'published',
            },
          },
          {
            featured: {
              equals: true,
            },
          },
        ],
      },
    }),
    payload.find({
      collection: 'articles',
      depth: 1,
      limit: 6,
      sort: '-publishedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 12,
      sort: 'title',
    }),
  ])

  const featured = featuredArticles.docs[0] || latestArticles.docs[0]
  const rest = latestArticles.docs.filter((article) => article.id !== featured?.id)
  const authorPhotoUrl = getMediaUrl(settings.authorPhoto)

  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">{settings.siteTitle}</p>
          <h1>{settings.siteDescription}</h1>
          {settings.authorBio && <p className="lead">{settings.authorBio}</p>}
          <div className="hero-actions">
            <Link className="button-link" href="/articles">
              Все статьи
            </Link>
            <Link className="secondary-link" href="/about">
              Об авторе
            </Link>
          </div>
          <SearchForm />
        </div>
        <div className="hero-panel">
          {featured ? (
            <ArticleCard article={featured} />
          ) : (
            <div className="empty-state">
              <p>Пока нет опубликованных статей.</p>
              <p>Зайдите в /admin, создайте первую статью и нажмите Publish.</p>
            </div>
          )}
        </div>
      </section>

      {rest.length > 0 && (
        <section className="section">
          <h2>Последние публикации</h2>
          <div className="article-grid">
            {rest.map((article) => (
              <ArticleCard article={article} key={article.id} />
            ))}
          </div>
        </section>
      )}

      <section className="section home-split">
        <div>
          <h2>Категории</h2>
          {categories.docs.length > 0 ? (
            <div className="category-list">
              {categories.docs.map((category) => (
                <Link href={`/categories/${category.slug}`} key={category.id}>
                  <span>{category.title}</span>
                  {category.description && <small>{category.description}</small>}
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state">Категории пока не добавлены.</div>
          )}
        </div>
        <aside className="author-summary">
          {authorPhotoUrl && (
            <Image
              alt={getMediaAlt(settings.authorPhoto) || settings.authorName}
              className="author-summary__photo"
              height={160}
              src={authorPhotoUrl}
              width={160}
            />
          )}
          <p className="eyebrow">Автор</p>
          <h3>{settings.authorName}</h3>
          {settings.authorBio && <p>{settings.authorBio}</p>}
          <Link className="secondary-link" href="/about">
            Подробнее
          </Link>
        </aside>
      </section>
    </>
  )
}
