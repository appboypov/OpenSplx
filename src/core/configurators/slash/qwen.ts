import { TomlSlashCommandConfigurator } from './toml-base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.qwen/commands/splx-archive.toml',
  'complete-task': '.qwen/commands/splx-complete-task.toml',
  'copy-next-task': '.qwen/commands/splx-copy-next-task.toml',
  'copy-review-request': '.qwen/commands/splx-copy-review-request.toml',
  'copy-test-request': '.qwen/commands/splx-copy-test-request.toml',
  'get-task': '.qwen/commands/splx-get-task.toml',
  'implement': '.qwen/commands/splx-implement.toml',
  'orchestrate': '.qwen/commands/splx-orchestrate.toml',
  'parse-feedback': '.qwen/commands/splx-parse-feedback.toml',
  'plan-implementation': '.qwen/commands/splx-plan-implementation.toml',
  'plan-proposal': '.qwen/commands/splx-plan-proposal.toml',
  'plan-request': '.qwen/commands/splx-plan-request.toml',
  'prepare-compact': '.qwen/commands/splx-prepare-compact.toml',
  'prepare-release': '.qwen/commands/splx-prepare-release.toml',
  'refine-architecture': '.qwen/commands/splx-refine-architecture.toml',
  'refine-release': '.qwen/commands/splx-refine-release.toml',
  'refine-review': '.qwen/commands/splx-refine-review.toml',
  'refine-testing': '.qwen/commands/splx-refine-testing.toml',
  'review': '.qwen/commands/splx-review.toml',
  'sync-workspace': '.qwen/commands/splx-sync-workspace.toml',
  'test': '.qwen/commands/splx-test.toml',
  'undo-task': '.qwen/commands/splx-undo-task.toml'
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
  'plan-implementation': 'Generate PROGRESS.md and orchestrate multi-agent task handoff.',
  'plan-proposal': 'Scaffold a new PLX change and validate strictly. Consumes request.md when present.',
  'plan-request': 'Clarify user intent through iterative yes/no questions before proposal creation.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md with spec-ready component inventories.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'refine-testing': 'Create or update TESTING.md.',
  'review': 'Review implementations against specs, changes, or tasks.',
  'sync-workspace': 'Scan workspace state and suggest maintenance actions.',
  'test': 'Run tests based on scope (change, task, or spec) using TESTING.md configuration.',
  'undo-task': 'Revert a task to to-do.'
};

export class QwenSlashCommandConfigurator extends TomlSlashCommandConfigurator {
  readonly toolId = 'qwen';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: SlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
