export function formatDate(value?: string | null) {
  if (!value) {
    return 'Без даты'
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export function getMediaUrl(media: unknown) {
  if (!media || typeof media !== 'object' || !('url' in media)) {
    return null
  }

  const url = media.url
  return typeof url === 'string' ? url : null
}

export function getMediaAlt(media: unknown) {
  if (!media || typeof media !== 'object' || !('alt' in media)) {
    return ''
  }

  const alt = media.alt
  return typeof alt === 'string' ? alt : ''
}

export function getRelationTitle(relation: unknown) {
  if (!relation || typeof relation !== 'object' || !('title' in relation)) {
    return null
  }

  return typeof relation.title === 'string' ? relation.title : null
}

export function getRelationSlug(relation: unknown) {
  if (!relation || typeof relation !== 'object' || !('slug' in relation)) {
    return null
  }

  return typeof relation.slug === 'string' ? relation.slug : null
}

export function getRelationId(relation: unknown) {
  if (typeof relation === 'number' || typeof relation === 'string') {
    return relation
  }

  if (!relation || typeof relation !== 'object' || !('id' in relation)) {
    return null
  }

  const id = relation.id
  return typeof id === 'number' || typeof id === 'string' ? id : null
}
