import Link from 'next/link'
import type { Where } from 'payload'

import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { getPayloadClient } from '@/shared/api/payload'

import styles from './ArticlesPage.module.css'

export const metadata = {
  title: 'Статьи',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

type ArticlesPageProps = {
  searchParams?: Promise<{
    category?: string
    tag?: string
  }>
}

type FilterItem = {
  id: number | string
  slug?: string | null
  title?: string | null
}

function getFilterLink(params: { category?: string; tag?: string }) {
  const query = new URLSearchParams()

  if (params.category) {
    query.set('category', params.category)
  }

  if (params.tag) {
    query.set('tag', params.tag)
  }

  const queryString = query.toString()

  return queryString ? `/articles?${queryString}` : '/articles'
}

function FilterGroup({
  activeSlug,
  items,
  label,
  paramName,
  searchParams,
}: {
  activeSlug?: string
  items: FilterItem[]
  label: string
  paramName: 'category' | 'tag'
  searchParams: { category?: string; tag?: string }
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <div className={styles.filterGroup}>
      <span>{label}</span>
      <div className={styles.filterLinks}>
        <Link
          aria-current={!activeSlug ? 'true' : undefined}
          href={getFilterLink({ ...searchParams, [paramName]: undefined })}
        >
          Все
        </Link>
        {items.map((item) => {
          if (!item.slug || !item.title) {
            return null
          }

          return (
            <Link
              aria-current={activeSlug === item.slug ? 'true' : undefined}
              href={getFilterLink({ ...searchParams, [paramName]: item.slug })}
              key={item.id}
            >
              {item.title}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const params = (await searchParams) || {}
  const payload = await getPayloadClient()
  const [categories, tags] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
      sort: 'title',
    }),
    payload.find({
      collection: 'tags',
      depth: 0,
      limit: 100,
      sort: 'title',
    }),
  ])
  const activeCategory = categories.docs.find((category) => category.slug === params.category)
  const activeTag = tags.docs.find((tag) => tag.slug === params.tag)
  const andFilters: Where[] = [
    {
      _status: {
        equals: 'published',
      },
    },
  ]

  if (activeCategory) {
    andFilters.push({
      category: {
        equals: activeCategory.id,
      },
    })
  }

  if (activeTag) {
    andFilters.push({
      tags: {
        contains: activeTag.id,
      },
    })
  }

  const articles = await payload.find({
    collection: 'articles',
    depth: 1,
    limit: 30,
    sort: '-publishedAt',
    where: { and: andFilters },
  })
  const hasFilter = Boolean(activeCategory || activeTag)
  const hasFilterOptions = categories.docs.length > 0 || tags.docs.length > 0

  return (
    <section>
      <p className="eyebrow">Архив</p>
      <h1>Статьи</h1>
      {hasFilterOptions && (
        <div className={styles.filters} aria-label="Фильтры статей">
          <FilterGroup
            activeSlug={activeCategory?.slug || undefined}
            items={categories.docs}
            label="Категории"
            paramName="category"
            searchParams={{ category: params.category, tag: params.tag }}
          />
          <FilterGroup
            activeSlug={activeTag?.slug || undefined}
            items={tags.docs}
            label="Темы"
            paramName="tag"
            searchParams={{ category: params.category, tag: params.tag }}
          />
        </div>
      )}
      {hasFilter && (
        <p className={styles.activeFilter}>
          Показаны статьи по выбранным фильтрам. <Link href="/articles">Сбросить фильтры</Link>
        </p>
      )}
      <div className="section article-list">
        {articles.docs.length > 0 ? (
          articles.docs.map((article) => <ArticleCard article={article} key={article.id} />)
        ) : (
          <div className="empty-state">По этим фильтрам пока нет опубликованных материалов.</div>
        )}
      </div>
    </section>
  )
}
