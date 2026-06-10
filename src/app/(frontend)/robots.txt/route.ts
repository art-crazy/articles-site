import { getBaseUrl } from '@/shared/lib/site'

export async function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api

Sitemap: ${getBaseUrl()}/sitemap.xml
`,
    {
      headers: {
        'Content-Type': 'text/plain',
      },
    },
  )
}
