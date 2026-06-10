import type { CollectionBeforeValidateHook, TypeWithID } from 'payload'

import { slugify } from '../../utilities/slugify'

type SlugSource = TypeWithID & {
  slug?: string | null
  title?: string | null
}

export const populateSlug: CollectionBeforeValidateHook<SlugSource> = ({ data, originalDoc }) => {
  if (!data) {
    return data
  }

  const currentSlug = data.slug || originalDoc?.slug
  const sourceTitle = data.title || originalDoc?.title

  if (!currentSlug && sourceTitle) {
    data.slug = slugify(sourceTitle)
  }

  if (data.slug) {
    data.slug = slugify(data.slug)
  }

  return data
}
