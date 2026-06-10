import * as migration_20260610_155829 from './20260610_155829';
import * as migration_20260610_191841_add_article_workflow from './20260610_191841_add_article_workflow';
import * as migration_20260610_225218_add_author_notes from './20260610_225218_add_author_notes';

export const migrations = [
  {
    up: migration_20260610_155829.up,
    down: migration_20260610_155829.down,
    name: '20260610_155829',
  },
  {
    up: migration_20260610_191841_add_article_workflow.up,
    down: migration_20260610_191841_add_article_workflow.down,
    name: '20260610_191841_add_article_workflow',
  },
  {
    up: migration_20260610_225218_add_author_notes.up,
    down: migration_20260610_225218_add_author_notes.down,
    name: '20260610_225218_add_author_notes',
  },
];
