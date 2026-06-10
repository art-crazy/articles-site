import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" ADD COLUMN "caption" varchar;
  ALTER TABLE "media" ADD COLUMN "credit" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_card_filename" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_url" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_width" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_height" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_mime_type" varchar;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_filesize" numeric;
  ALTER TABLE "media" ADD COLUMN "sizes_cover_filename" varchar;
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_cover_sizes_cover_filename_idx" ON "media" USING btree ("sizes_cover_filename");`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX "media_sizes_card_sizes_card_filename_idx";
  DROP INDEX "media_sizes_cover_sizes_cover_filename_idx";
  ALTER TABLE "media" DROP COLUMN "caption";
  ALTER TABLE "media" DROP COLUMN "credit";
  ALTER TABLE "media" DROP COLUMN "sizes_card_url";
  ALTER TABLE "media" DROP COLUMN "sizes_card_width";
  ALTER TABLE "media" DROP COLUMN "sizes_card_height";
  ALTER TABLE "media" DROP COLUMN "sizes_card_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_card_filename";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_url";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_width";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_height";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_mime_type";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_filesize";
  ALTER TABLE "media" DROP COLUMN "sizes_cover_filename";`)
}
