import * as migration_20260610_155829 from './20260610_155829';
import * as migration_20260610_191841_add_article_workflow from './20260610_191841_add_article_workflow';

export const migrations = [
  {
    up: migration_20260610_155829.up,
    down: migration_20260610_155829.down,
    name: '20260610_155829',
  },
  {
    up: migration_20260610_191841_add_article_workflow.up,
    down: migration_20260610_191841_add_article_workflow.down,
    name: '20260610_191841_add_article_workflow'
  },
];
