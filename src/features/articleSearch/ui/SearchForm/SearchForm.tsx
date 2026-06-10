import styles from './SearchForm.module.css'

export function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form action="/search" className={styles.form}>
      <input
        aria-label="Поиск по статьям"
        className={styles.input}
        defaultValue={defaultValue}
        name="q"
        placeholder="Поиск по статьям"
        type="search"
      />
      <button className={styles.button} type="submit">
        Найти
      </button>
    </form>
  )
}
