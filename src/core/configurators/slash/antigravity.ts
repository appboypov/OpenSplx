import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.agent/workflows/splx-archive.md',
  'complete-task': '.agent/workflows/splx-complete-task.md',
  'copy-next-task': '.agent/workflows/splx-copy-next-task.md',
  'copy-review-request': '.agent/workflows/splx-copy-review-request.md',
  'copy-test-request': '.agent/workflows/splx-copy-test-request.md',
  'get-task': '.agent/workflows/splx-get-task.md',
  'implement': '.agent/workflows/splx-implement.md',
  'orchestrate': '.agent/workflows/splx-orchestrate.md',
  'parse-feedback': '.agent/workflows/splx-parse-feedback.md',
  'plan-implementation': '.agent/workflows/splx-plan-implementation.md',
  'plan-proposal': '.agent/workflows/splx-plan-proposal.md',
  'plan-request': '.agent/workflows/splx-plan-request.md',
  'prepare-compact': '.agent/workflows/splx-prepare-compact.md',
  'prepare-release': '.agent/workflows/splx-prepare-release.md',
  'refine-architecture': '.agent/workflows/splx-refine-architecture.md',
  'refine-release': '.agent/workflows/splx-refine-release.md',
  'refine-review': '.agent/workflows/splx-refine-review.md',
  'refine-testing': '.agent/workflows/splx-refine-testing.md',
  'review': '.agent/workflows/splx-review.md',
  'sync-tasks': '.agent/workflows/splx-sync-tasks.md',
  'sync-workspace': '.agent/workflows/splx-sync-workspace.md',
  'test': '.agent/workflows/splx-test.md',
  'undo-task': '.agent/workflows/splx-undo-task.md'
};

const DESCRIPTIONS: Record<SlashCommandId, string> = {
  'archive': 'Archive a deployed PLX change and update specs.',
  'complete-task': 'Mark a task as done.',
  'copy-next-task': 'Copy next task or feedback block to clipboard for external agent handoff.',
  'copy-review-request': 'Copy review request block with REVIEW.md guidelines to clipboard for external agent.',
  'copy-test-request': 'Copy test request block with TESTING.md configuration to clipboard for external agent.',
  'get-task': 'Select and display the next prioritized task to work on.',
  'implement': 'Implement an approved PLX change and keep tasks in sync.',
  'orchestrate': 'Orchestrate sub-agents to complete work collaboratively.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'plan-implementation': 'Orchestrate multi-agent task handoff for a change.',
  'plan-proposal': 'Scaffold a new PLX change and validate strictly. Consumes request.md when present.',
  'plan-request': 'Clarify user intent through iterative yes/no questions before proposal creation.',
  'prepare-compact': 'Preserve session progress for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md with spec-ready component inventories.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'refine-testing': 'Create or update TESTING.md.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'sync-tasks': 'Sync tasks with external project management tools via MCPs (Linear, GitHub, Jira).',
  'sync-workspace': 'Scan workspace state and suggest maintenance actions.',
  'test': 'Run tests based on scope (change, task, or spec) using TESTING.md configuration.',
  'undo-task': 'Revert a task to to-do.'
};

export class AntigravitySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'antigravity';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const description = DESCRIPTIONS[id];
    return `---\ndescription: ${description}\n---`;
  }
}
