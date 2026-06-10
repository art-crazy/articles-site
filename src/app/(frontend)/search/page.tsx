import { ArticleCard } from '@/entities/article/ui/ArticleCard/ArticleCard'
import { SearchForm } from '@/features/articleSearch/ui/SearchForm/SearchForm'
import { getPayloadClient } from '@/shared/api/payload'

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
  const articles = query
    ? await payload.find({
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
    : null

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
            <div className="empty-state">Ничего не найдено.</div>
          )}
        </div>
      )}
    </section>
  )
}
