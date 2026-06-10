# Articles Site

Next.js + Payload CMS site for an author's articles.

## Stack

- Next.js App Router
- Payload CMS admin at `/admin`
- PostgreSQL
- Local uploads for development

## Local Development

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

3. Install dependencies and run the app:

   ```bash
   pnpm install
   pnpm dev
   ```

4. Open:

   - Site: http://localhost:3000
   - Admin: http://localhost:3000/admin

Payload will ask you to create the first admin user on first visit.

## Content Model

- `Articles`: title, slug, excerpt, cover image, rich text content, category, tags, publish date, SEO fields
- `Media`: uploads with required alt text
- `Categories`
- `Tags`
- `Users`: admin users

## Backups

Create a local backup:

```bash
pnpm backup
```

The archive is saved to `backups/`. Restore notes are in `docs/backup-restore.md`.

## Production Notes

For production, use managed PostgreSQL or a backed-up Postgres instance. Move uploads to S3-compatible storage such as Cloudflare R2 before real publishing if the app is deployed to ephemeral infrastructure.
