import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "subtitle" varchar;
    ALTER TABLE "articles" ADD COLUMN IF NOT EXISTS "reading_time" numeric;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_subtitle" varchar;
    ALTER TABLE "_articles_v" ADD COLUMN IF NOT EXISTS "version_reading_time" numeric;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_reading_time";
    ALTER TABLE "_articles_v" DROP COLUMN IF EXISTS "version_subtitle";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "reading_time";
    ALTER TABLE "articles" DROP COLUMN IF EXISTS "subtitle";
  `)
}
