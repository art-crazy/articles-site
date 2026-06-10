import { getPayloadClient } from './payload'

export async function getSiteSettings() {
  const payload = await getPayloadClient()

  return payload.findGlobal({
    slug: 'site-settings',
    depth: 1,
  })
}
