import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.cursor/commands/splx-archive.md',
  'complete-task': '.cursor/commands/splx-complete-task.md',
  'copy-next-task': '.cursor/commands/splx-copy-next-task.md',
  'copy-review-request': '.cursor/commands/splx-copy-review-request.md',
  'copy-test-request': '.cursor/commands/splx-copy-test-request.md',
  'get-task': '.cursor/commands/splx-get-task.md',
  'implement': '.cursor/commands/splx-implement.md',
  'orchestrate': '.cursor/commands/splx-orchestrate.md',
  'parse-feedback': '.cursor/commands/splx-parse-feedback.md',
  'plan-implementation': '.cursor/commands/splx-plan-implementation.md',
  'plan-proposal': '.cursor/commands/splx-plan-proposal.md',
  'plan-request': '.cursor/commands/splx-plan-request.md',
  'prepare-compact': '.cursor/commands/splx-prepare-compact.md',
  'prepare-release': '.cursor/commands/splx-prepare-release.md',
  'refine-architecture': '.cursor/commands/splx-refine-architecture.md',
  'refine-release': '.cursor/commands/splx-refine-release.md',
  'refine-review': '.cursor/commands/splx-refine-review.md',
  'refine-testing': '.cursor/commands/splx-refine-testing.md',
  'review': '.cursor/commands/splx-review.md',
  'sync-workspace': '.cursor/commands/splx-sync-workspace.md',
  'test': '.cursor/commands/splx-test.md',
  'undo-task': '.cursor/commands/splx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: /splx-archive
id: splx-archive
category: OpenSplx
description: Archive a deployed change and update specs.
---`,
  'complete-task': `---
name: /splx-complete-task
id: splx-complete-task
category: OpenSplx
description: Mark a task as done.
---`,
  'copy-next-task': `---
name: /splx-copy-next-task
id: splx-copy-next-task
category: OpenSplx
description: Copy next task or feedback block to clipboard for external agent handoff.
---`,
  'copy-review-request': `---
name: /splx-copy-review-request
id: splx-copy-review-request
category: OpenSplx
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
---`,
  'copy-test-request': `---
name: /splx-copy-test-request
id: splx-copy-test-request
category: OpenSplx
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
---`,
  'get-task': `---
name: /splx-get-task
id: splx-get-task
category: OpenSplx
description: Select and display the next prioritized task to work on.
---`,
  'implement': `---
name: /splx-implement
id: splx-implement
category: OpenSplx
description: Implement an approved change and keep tasks in sync.
---`,
  'orchestrate': `---
name: /splx-orchestrate
id: splx-orchestrate
category: OpenSplx
description: Orchestrate sub-agents to complete work collaboratively.
---`,
  'parse-feedback': `---
name: /splx-parse-feedback
id: splx-parse-feedback
category: OpenSplx
description: Parse feedback markers and generate review tasks.
---`,
  'plan-implementation': `---
name: /splx-plan-implementation
id: splx-plan-implementation
category: OpenSplx
description: Generate PROGRESS.md and orchestrate multi-agent task handoff.
---`,
  'plan-proposal': `---
name: /splx-plan-proposal
id: splx-plan-proposal
category: OpenSplx
description: Scaffold a new change and validate strictly. Consumes request.md when present.
---`,
  'plan-request': `---
name: /splx-plan-request
id: splx-plan-request
category: OpenSplx
description: Clarify user intent through iterative yes/no questions before proposal creation.
---`,
  'prepare-compact': `---
name: /splx-prepare-compact
id: splx-prepare-compact
category: OpenSplx
description: Preserve session progress in PROGRESS.md for context continuity.
---`,
  'prepare-release': `---
name: /splx-prepare-release
id: splx-prepare-release
category: OpenSplx
description: Prepare release by updating changelog, readme, and architecture documentation.
---`,
  'refine-architecture': `---
name: /splx-refine-architecture
id: splx-refine-architecture
category: OpenSplx
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
---`,
  'refine-release': `---
name: /splx-refine-release
id: splx-refine-release
category: OpenSplx
description: Create or update RELEASE.md.
---`,
  'refine-review': `---
name: /splx-refine-review
id: splx-refine-review
category: OpenSplx
description: Create or update REVIEW.md.
---`,
  'refine-testing': `---
name: /splx-refine-testing
id: splx-refine-testing
category: OpenSplx
description: Create or update TESTING.md.
---`,
  'review': `---
name: /splx-review
id: splx-review
category: OpenSplx
description: Review implementations against specs, changes, or tasks.
---`,
  'sync-workspace': `---
name: /splx-sync-workspace
id: splx-sync-workspace
category: OpenSplx
description: Scan workspace state and suggest maintenance actions.
---`,
  'test': `---
name: /splx-test
id: splx-test
category: OpenSplx
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
---`,
  'undo-task': `---
name: /splx-undo-task
id: splx-undo-task
category: OpenSplx
description: Revert a task to to-do.
---`
};

export class CursorSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'cursor';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
