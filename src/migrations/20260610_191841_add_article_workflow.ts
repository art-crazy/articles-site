import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload: _payload, req: _req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_articles_workflow_status" AS ENUM('idea', 'draft', 'review', 'ready');
  CREATE TYPE "public"."enum__articles_v_version_workflow_status" AS ENUM('idea', 'draft', 'review', 'ready');
  ALTER TABLE "articles" ADD COLUMN "workflow_status" "enum_articles_workflow_status" DEFAULT 'draft';
  ALTER TABLE "articles" ADD COLUMN "publish_checklist_checked_excerpt" boolean;
  ALTER TABLE "articles" ADD COLUMN "publish_checklist_checked_cover" boolean;
  ALTER TABLE "articles" ADD COLUMN "publish_checklist_checked_category" boolean;
  ALTER TABLE "articles" ADD COLUMN "publish_checklist_checked_slug" boolean;
  ALTER TABLE "articles" ADD COLUMN "publish_checklist_checked_preview" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "version_workflow_status" "enum__articles_v_version_workflow_status" DEFAULT 'draft';
  ALTER TABLE "_articles_v" ADD COLUMN "version_publish_checklist_checked_excerpt" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "version_publish_checklist_checked_cover" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "version_publish_checklist_checked_category" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "version_publish_checklist_checked_slug" boolean;
  ALTER TABLE "_articles_v" ADD COLUMN "version_publish_checklist_checked_preview" boolean;
  ALTER TABLE "site_settings" ADD COLUMN "author_topics" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "contact_text" varchar;`)
}

export async function down({ db, payload: _payload, req: _req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "articles" DROP COLUMN "workflow_status";
  ALTER TABLE "articles" DROP COLUMN "publish_checklist_checked_excerpt";
  ALTER TABLE "articles" DROP COLUMN "publish_checklist_checked_cover";
  ALTER TABLE "articles" DROP COLUMN "publish_checklist_checked_category";
  ALTER TABLE "articles" DROP COLUMN "publish_checklist_checked_slug";
  ALTER TABLE "articles" DROP COLUMN "publish_checklist_checked_preview";
  ALTER TABLE "_articles_v" DROP COLUMN "version_workflow_status";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publish_checklist_checked_excerpt";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publish_checklist_checked_cover";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publish_checklist_checked_category";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publish_checklist_checked_slug";
  ALTER TABLE "_articles_v" DROP COLUMN "version_publish_checklist_checked_preview";
  ALTER TABLE "site_settings" DROP COLUMN "author_topics";
  ALTER TABLE "site_settings" DROP COLUMN "contact_text";
  DROP TYPE "public"."enum_articles_workflow_status";
  DROP TYPE "public"."enum__articles_v_version_workflow_status";`)
}
