import { getPayloadClient } from '@/shared/api/payload'
import { getSiteSettings } from '@/shared/api/siteSettings'
import { escapeXml, getBaseUrl } from '@/shared/lib/site'

export async function GET() {
  const payload = await getPayloadClient()
  const settings = await getSiteSettings()
  const articles = await payload.find({
    collection: 'articles',
    depth: 0,
    limit: 50,
    sort: '-publishedAt',
    where: {
      _status: {
        equals: 'published',
      },
    },
  })
  const baseUrl = getBaseUrl()

  const items = articles.docs
    .map((article) => {
      const url = `${baseUrl}/articles/${article.slug}`

      return `<item>
        <title>${escapeXml(article.title)}</title>
        <link>${escapeXml(url)}</link>
        <guid>${escapeXml(url)}</guid>
        <description>${escapeXml(article.excerpt || '')}</description>
        <pubDate>${new Date(article.publishedAt || article.createdAt).toUTCString()}</pubDate>
      </item>`
    })
    .join('')

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${escapeXml(settings.siteTitle)}</title>
        <link>${escapeXml(baseUrl)}</link>
        <description>${escapeXml(settings.siteDescription)}</description>
        <language>ru</language>
        ${items}
      </channel>
    </rss>`,
    {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
      },
    },
  )
}
