import React from 'react'
import './styles.css'

import { getSiteSettings } from '@/shared/api/siteSettings'
import { SiteFooter } from '@/shared/ui/SiteFooter/SiteFooter'
import { SiteHeader } from '@/shared/ui/SiteHeader/SiteHeader'

export const metadata = {
  description: 'Авторский сайт со статьями и админкой на Next.js и Payload.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Личный журнал',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const settings = await getSiteSettings()

  return (
    <html lang="ru">
      <body>
        <div className="site-shell">
          <SiteHeader siteTitle={settings.siteTitle} />
          <main className="site-main">{children}</main>
          <SiteFooter authorName={settings.authorName} siteTitle={settings.siteTitle} />
        </div>
      </body>
    </html>
  )
}
