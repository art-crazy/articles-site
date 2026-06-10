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
