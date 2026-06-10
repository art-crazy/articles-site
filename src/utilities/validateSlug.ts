const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export const slugDescription =
  'Заполнится автоматически. Если меняете вручную, используйте только латинские буквы, цифры и дефисы: primer-adresa.'

export function validateSlug(value: unknown) {
  if (!value) {
    return true
  }

  if (typeof value !== 'string') {
    return 'Адрес страницы должен быть строкой.'
  }

  if (slugPattern.test(value)) {
    return true
  }

  return 'Используйте только латинские буквы, цифры и дефисы. Например: moy-primer-2026.'
}
