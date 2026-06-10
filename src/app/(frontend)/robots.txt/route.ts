function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
}

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
