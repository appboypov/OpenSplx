import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.clinerules/workflows/plx-get-task.md',
  'orchestrate': '.clinerules/workflows/plx-orchestrate.md',
  'parse-feedback': '.clinerules/workflows/plx-parse-feedback.md',
  'prepare-compact': '.clinerules/workflows/plx-prepare-compact.md',
  'prepare-release': '.clinerules/workflows/plx-prepare-release.md',
  'refine-architecture': '.clinerules/workflows/plx-refine-architecture.md',
  'refine-release': '.clinerules/workflows/plx-refine-release.md',
  'refine-review': '.clinerules/workflows/plx-refine-review.md',
  'review': '.clinerules/workflows/plx-review.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'orchestrate': `# PLX: Orchestrate

Orchestrate sub-agents to complete work collaboratively.`,
  'parse-feedback': `# PLX: Parse Feedback

Parse feedback markers and generate review tasks.`,
  'prepare-compact': `# PLX: Prepare Compact

Preserve session progress in PROGRESS.md for context continuity.`,
  'prepare-release': `# PLX: Prepare Release

Prepare release by updating changelog, readme, and architecture documentation.`,
  'refine-architecture': `# PLX: Refine Architecture

Create or update ARCHITECTURE.md.`,
  'refine-release': `# PLX: Refine Release

Create or update RELEASE.md.`,
  'refine-review': `# PLX: Refine Review

Create or update REVIEW.md.`,
  'review': `# PLX: Review

Review implementations against specs, changes, or tasks.`
};

export class PlxClineSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'cline';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
