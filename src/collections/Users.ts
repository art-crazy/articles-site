import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    group: 'Настройки',
    useAsTitle: 'email',
  },
  auth: true,
  labels: {
    plural: 'Администраторы',
    singular: 'Администратор',
  },
  fields: [],
}
