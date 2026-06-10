import { getPayloadClient } from '@/shared/api/payload'

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

function urlEntry(path: string, lastModified?: string) {
  const loc = `${getBaseUrl()}${path}`
  const lastmod = lastModified ? `<lastmod>${new Date(lastModified).toISOString()}</lastmod>` : ''

  return `<url><loc>${loc}</loc>${lastmod}</url>`
}

export async function GET() {
  const payload = await getPayloadClient()
  const [articles, categories, tags] = await Promise.all([
    payload.find({
      collection: 'articles',
      limit: 1000,
      sort: '-updatedAt',
      where: {
        _status: {
          equals: 'published',
        },
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 1000,
      sort: 'title',
    }),
    payload.find({
      collection: 'tags',
      limit: 1000,
      sort: 'title',
    }),
  ])

  const urls = [
    urlEntry('/'),
    urlEntry('/about'),
    urlEntry('/articles'),
    ...articles.docs.map((article) => urlEntry(`/articles/${article.slug}`, article.updatedAt)),
    ...categories.docs.map((category) => urlEntry(`/categories/${category.slug}`, category.updatedAt)),
    ...tags.docs.map((tag) => urlEntry(`/tags/${tag.slug}`, tag.updatedAt)),
  ]

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  )
}
