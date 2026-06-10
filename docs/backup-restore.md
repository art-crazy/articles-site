# Backup And Restore

## Create Backup

Run:

```bash
pnpm backup
```

The archive is created in `backups/` and contains:

- `database.sql` with PostgreSQL data;
- `media/` with uploaded files, if the folder exists.

`backups/` is ignored by Git.

## Restore With Script

Run:

```powershell
pnpm restore -- backups\articles-site-YYYYMMDD-HHMMSS.zip
```

The restore script first creates a safety backup of the current state, then restores:

- PostgreSQL from `database.sql`;
- `media/`, if the archive contains uploaded files.

If local `media/` already exists, it is moved to `media.before-restore-...`.

## Restore Manually

1. Stop the dev server if it is running.
2. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

3. Unzip the selected archive from `backups/`.
4. Restore the database:

   ```powershell
   Get-Content .\database.sql | docker compose exec -T postgres psql -U postgres -d articles_site
   ```

5. Replace local uploads if the archive contains `media/`.
6. Start the app again:

   ```bash
   pnpm dev
   ```
