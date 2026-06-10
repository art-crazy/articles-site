export function AuthorDashboardHelp() {
  return (
    <div
      style={{
        background: '#f6f1e9',
        border: '1px solid #ded9ce',
        borderRadius: 4,
        color: '#20201d',
        marginBottom: 24,
        padding: 18,
      }}
    >
      <strong>Памятка автора</strong>
      <p style={{ margin: '8px 0 12px' }}>
        Короткая инструкция по созданию, проверке и публикации статей.
      </p>
      <a href="/admin-help" style={{ color: '#3f2a1a', fontWeight: 700 }}>
        Открыть памятку
      </a>
    </div>
  )
}
