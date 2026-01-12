import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.kilocode/workflows/splx-archive.md',
  'complete-task': '.kilocode/workflows/splx-complete-task.md',
  'copy-next-task': '.kilocode/workflows/splx-copy-next-task.md',
  'copy-review-request': '.kilocode/workflows/splx-copy-review-request.md',
  'copy-test-request': '.kilocode/workflows/splx-copy-test-request.md',
  'get-task': '.kilocode/workflows/splx-get-task.md',
  'implement': '.kilocode/workflows/splx-implement.md',
  'orchestrate': '.kilocode/workflows/splx-orchestrate.md',
  'parse-feedback': '.kilocode/workflows/splx-parse-feedback.md',
  'plan-implementation': '.kilocode/workflows/splx-plan-implementation.md',
  'plan-proposal': '.kilocode/workflows/splx-plan-proposal.md',
  'plan-request': '.kilocode/workflows/splx-plan-request.md',
  'prepare-compact': '.kilocode/workflows/splx-prepare-compact.md',
  'prepare-release': '.kilocode/workflows/splx-prepare-release.md',
  'refine-architecture': '.kilocode/workflows/splx-refine-architecture.md',
  'refine-release': '.kilocode/workflows/splx-refine-release.md',
  'refine-review': '.kilocode/workflows/splx-refine-review.md',
  'refine-testing': '.kilocode/workflows/splx-refine-testing.md',
  'review': '.kilocode/workflows/splx-review.md',
  'sync-workspace': '.kilocode/workflows/splx-sync-workspace.md',
  'test': '.kilocode/workflows/splx-test.md',
  'undo-task': '.kilocode/workflows/splx-undo-task.md'
};

export class KiloCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'kilocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(_id: SlashCommandId): string | undefined {
    return undefined;
  }
}
