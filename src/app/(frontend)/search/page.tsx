import Link from 'next/link'

import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { SearchForm } from '@/features/articleSearch/ui/SearchForm/SearchForm'
import { getPayloadClient } from '@/shared/api/payload'

import styles from './SearchPage.module.css'

export const metadata = {
  title: 'Поиск',
}

export const revalidate = 0
export const dynamic = 'force-dynamic'

type SearchPageProps = {
  searchParams: Promise<{
    q?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const payload = await getPayloadClient()
  const [articles, categories, tags] = await Promise.all([
    query
      ? payload.find({
          collection: 'articles',
          depth: 1,
          limit: 30,
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
                  {
                    title: {
                      like: query,
                    },
                  },
                  {
                    excerpt: {
                      like: query,
                    },
                  },
                ],
              },
            ],
          },
        })
      : null,
    payload.find({
      collection: 'categories',
      limit: 4,
      sort: 'title',
    }),
    payload.find({
      collection: 'tags',
      limit: 6,
      sort: 'title',
    }),
  ])

  return (
    <section>
      <p className="eyebrow">Поиск</p>
      <h1>Поиск по статьям</h1>
      <div className="section">
        <SearchForm defaultValue={query} />
      </div>
      {articles && (
        <div className="section article-list">
          {articles.docs.length > 0 ? (
            articles.docs.map((article) => <ArticleCard article={article} key={article.id} />)
          ) : (
            <div className="empty-state">
              Ничего не найдено. Попробуйте другой запрос или посмотрите темы сайта.
            </div>
          )}
        </div>
      )}
      <div className={styles.suggestions}>
        <p>{query ? 'Можно продолжить через темы и теги.' : 'Начните с поиска или откройте одну из тем.'}</p>
        <div className={styles.links}>
          <Link href="/articles">Все статьи</Link>
          <Link href="/categories">Категории</Link>
          <Link href="/tags">Теги</Link>
          {categories.docs.map((category) => (
            <Link href={`/categories/${category.slug}`} key={category.id}>
              {category.title}
            </Link>
          ))}
          {tags.docs.map((tag) => (
            <Link href={`/tags/${tag.slug}`} key={tag.id}>
              #{tag.title}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
