import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.windsurf/workflows/plx-get-task.md',
  'orchestrate': '.windsurf/workflows/plx-orchestrate.md',
  'parse-feedback': '.windsurf/workflows/plx-parse-feedback.md',
  'prepare-compact': '.windsurf/workflows/plx-prepare-compact.md',
  'prepare-release': '.windsurf/workflows/plx-prepare-release.md',
  'refine-architecture': '.windsurf/workflows/plx-refine-architecture.md',
  'refine-release': '.windsurf/workflows/plx-refine-release.md',
  'refine-review': '.windsurf/workflows/plx-refine-review.md',
  'review': '.windsurf/workflows/plx-review.md'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'get-task': 'Select and display the next prioritized task to work on.',
  'orchestrate': 'Orchestrate sub-agents to complete work collaboratively.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'review': 'Review implementations against specs, changes, or tasks.'
};

export class PlxWindsurfSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'windsurf';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\nauto_execution_mode: 3\n---`;
  }
}
