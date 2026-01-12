import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.roo/commands/splx-archive.md',
  'complete-task': '.roo/commands/splx-complete-task.md',
  'copy-next-task': '.roo/commands/splx-copy-next-task.md',
  'copy-review-request': '.roo/commands/splx-copy-review-request.md',
  'copy-test-request': '.roo/commands/splx-copy-test-request.md',
  'get-task': '.roo/commands/splx-get-task.md',
  'implement': '.roo/commands/splx-implement.md',
  'orchestrate': '.roo/commands/splx-orchestrate.md',
  'parse-feedback': '.roo/commands/splx-parse-feedback.md',
  'plan-implementation': '.roo/commands/splx-plan-implementation.md',
  'plan-proposal': '.roo/commands/splx-plan-proposal.md',
  'plan-request': '.roo/commands/splx-plan-request.md',
  'prepare-compact': '.roo/commands/splx-prepare-compact.md',
  'prepare-release': '.roo/commands/splx-prepare-release.md',
  'refine-architecture': '.roo/commands/splx-refine-architecture.md',
  'refine-release': '.roo/commands/splx-refine-release.md',
  'refine-review': '.roo/commands/splx-refine-review.md',
  'refine-testing': '.roo/commands/splx-refine-testing.md',
  'review': '.roo/commands/splx-review.md',
  'sync-workspace': '.roo/commands/splx-sync-workspace.md',
  'test': '.roo/commands/splx-test.md',
  'undo-task': '.roo/commands/splx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `# PLX: Archive

Archive a deployed PLX change and update specs.`,
  'complete-task': `# PLX: Complete Task

Mark a task as done.`,
  'copy-next-task': `# PLX: Copy Next Task

Copy next task or feedback block to clipboard for external agent handoff.`,
  'copy-review-request': `# PLX: Copy Review Request

Copy review request block with REVIEW.md guidelines to clipboard for external agent.`,
  'copy-test-request': `# PLX: Copy Test Request

Copy test request block with TESTING.md configuration to clipboard for external agent.`,
  'get-task': `# PLX: Get Task

Select and display the next prioritized task to work on.`,
  'implement': `# PLX: Implement

Implement an approved PLX change and keep tasks in sync.`,
  'orchestrate': `# PLX: Orchestrate

Orchestrate sub-agents to complete work collaboratively.`,
  'parse-feedback': `# PLX: Parse Feedback

Parse feedback markers and generate review tasks.`,
  'plan-implementation': `# PLX: Plan Implementation

Generate PROGRESS.md and orchestrate multi-agent task handoff.`,
  'plan-proposal': `# PLX: Plan Proposal

Scaffold a new PLX change and validate strictly. Consumes request.md when present.`,
  'plan-request': `# PLX: Plan Request

Clarify user intent through iterative yes/no questions before proposal creation.`,
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
  'refine-testing': `# PLX: Refine Testing

Create or update TESTING.md.`,
  'review': `# PLX: Review

Review implementations against specs, changes, or tasks.`,
  'sync-workspace': `# PLX: Sync Workspace

Scan workspace state and suggest maintenance actions.`,
  'test': `# PLX: Test

Run tests based on scope (change, task, or spec) using TESTING.md configuration.`,
  'undo-task': `# PLX: Undo Task

Revert a task to to-do.`
};

export class RooCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'roocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }
}
