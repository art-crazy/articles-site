import Image from 'next/image'

import { getSiteSettings } from '@/shared/api/siteSettings'
import { getMediaAlt, getMediaUrl } from '@/shared/lib/format'

export const metadata = {
  title: 'Об авторе',
}

export const revalidate = 60
export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const settings = await getSiteSettings()
  const photoUrl = getMediaUrl(settings.authorPhoto)

  return (
    <section className="about-page">
      <div>
        <p className="eyebrow">Об авторе</p>
        <h1>{settings.authorName}</h1>
        {settings.authorBio && <p className="lead">{settings.authorBio}</p>}
        {settings.socialLinks && settings.socialLinks.length > 0 && (
          <div className="social-list">
            {settings.socialLinks.map((link) => (
              <a href={link.url} key={link.id || link.url} rel="noreferrer" target="_blank">
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
      {photoUrl && (
        <Image
          alt={getMediaAlt(settings.authorPhoto) || settings.authorName}
          className="author-photo"
          height={760}
          priority
          src={photoUrl}
          width={640}
        />
      )}
    </section>
  )
}
