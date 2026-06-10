import Link from 'next/link'

import { SearchForm } from '@/features/articleSearch/ui/SearchForm/SearchForm'

export default function NotFoundPage() {
  return (
    <section className="not-found-page">
      <p className="eyebrow">Страница не найдена</p>
      <h1>Такой страницы нет</h1>
      <p className="lead">
        Возможно, ссылка устарела или в адресе есть ошибка. Можно вернуться к статьям или найти
        нужный материал через поиск.
      </p>
      <div className="hero-actions">
        <Link className="button-link" href="/">
          На главную
        </Link>
        <Link className="secondary-link" href="/articles">
          Все статьи
        </Link>
        <Link className="secondary-link" href="/categories">
          Темы
        </Link>
        <Link className="secondary-link" href="/search">
          Поиск
        </Link>
      </div>
      <SearchForm />
    </section>
  )
}
