'use client'

import { useFormFields } from '@payloadcms/ui'

const checklistFields = [
  'publishChecklist.checkedExcerpt',
  'publishChecklist.checkedCover',
  'publishChecklist.checkedCategory',
  'publishChecklist.checkedSlug',
  'publishChecklist.checkedPreview',
]

function hasValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0
  }

  return value !== null && value !== undefined && value !== ''
}

export function ArticleQualityNotice() {
  const values = useFormFields(([fields]) => ({
    category: fields.category?.value,
    checkedItems: checklistFields.filter((field) => fields[field]?.value === true).length,
    coverImage: fields.coverImage?.value,
    excerpt: fields.excerpt?.value,
    slug: fields.slug?.value,
  }))
  const warnings = []
  const excerpt = typeof values.excerpt === 'string' ? values.excerpt.trim() : ''
  const slug = typeof values.slug === 'string' ? values.slug.trim() : ''

  if (excerpt.length < 80) {
    warnings.push('Краткое описание лучше сделать чуть подробнее: 1-2 понятных предложения.')
  }

  if (!hasValue(values.coverImage)) {
    warnings.push('Добавьте обложку, чтобы статья хорошо выглядела в списках и на главной странице.')
  }

  if (!hasValue(values.category)) {
    warnings.push('Выберите категорию, чтобы читателю было проще найти похожие материалы.')
  }

  if (!slug) {
    warnings.push('Проверьте адрес страницы после сохранения черновика.')
  }

  if (values.checkedItems < checklistFields.length) {
    warnings.push('Перед публикацией отметьте все пункты чеклиста.')
  }

  return (
    <div
      style={{
        background: warnings.length > 0 ? '#fff8d8' : '#edf8ed',
        border: '1px solid #ded9ce',
        borderLeft: `4px solid ${warnings.length > 0 ? '#9c7415' : '#487a45'}`,
        color: '#20201d',
        marginBottom: 18,
        padding: 16,
      }}
    >
      <strong>{warnings.length > 0 ? 'Что проверить перед публикацией' : 'Статья выглядит готовой'}</strong>
      {warnings.length > 0 ? (
        <ul style={{ margin: '10px 0 0', paddingLeft: 20 }}>
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      ) : (
        <p style={{ margin: '10px 0 0' }}>Основные поля заполнены, чеклист отмечен.</p>
      )}
    </div>
  )
}
