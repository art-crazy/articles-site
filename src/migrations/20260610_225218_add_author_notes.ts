import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" ADD COLUMN "author_notes" varchar;
  ALTER TABLE "_articles_v" ADD COLUMN "version_author_notes" varchar;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "author_notes";
  ALTER TABLE "_articles_v" DROP COLUMN "version_author_notes";`)
}
