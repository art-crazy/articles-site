import { postgresAdapter } from '@payloadcms/db-postgres'
import {
  BlocksFeature,
  FixedToolbarFeature,
  lexicalEditor,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { ru } from '@payloadcms/translations/languages/ru'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Articles } from './collections/Articles'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { SiteSettings } from './globals/SiteSettings'
import { Callout } from './blocks/Callout'
import { Divider } from './blocks/Divider'
import { RelatedArticle } from './blocks/RelatedArticle'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    components: {
      beforeDashboard: ['@/app/(payload)/admin/components/AuthorDashboardHelp#AuthorDashboardHelp'],
    },
    meta: {
      titleSuffix: ' - Админка',
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Articles, Categories, Tags],
  globals: [SiteSettings],
  i18n: {
    fallbackLanguage: 'ru',
    supportedLanguages: {
      ru,
    },
    translations: {
      ru: {
        authentication: {
          emailOrPasswordIncorrect: 'Указаны неверная электронная почта или пароль.',
          emailOrUsername: 'Электронная почта',
          emailSent: 'Письмо отправлено',
          forgotPasswordEmailInstructions:
            'Введите электронную почту. Мы отправим письмо с инструкцией по восстановлению пароля.',
          verifyYourEmail: 'Подтвердите электронную почту',
        },
        error: {
          missingEmail: 'Укажите электронную почту.',
          userEmailAlreadyRegistered: 'Администратор с такой электронной почтой уже зарегистрирован.',
        },
        general: {
          email: 'Электронная почта',
          emailAddress: 'Электронная почта',
        },
        validation: {
          emailAddress: 'Введите корректный адрес электронной почты.',
        },
      },
    },
  },
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      UploadFeature({
        enabledCollections: ['media'],
      }),
      BlocksFeature({
        blocks: [Callout, Divider, RelatedArticle],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
