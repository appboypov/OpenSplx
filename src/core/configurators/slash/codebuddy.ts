import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.codebuddy/commands/splx/archive.md',
  'complete-task': '.codebuddy/commands/splx/complete-task.md',
  'copy-next-task': '.codebuddy/commands/splx/copy-next-task.md',
  'copy-review-request': '.codebuddy/commands/splx/copy-review-request.md',
  'copy-test-request': '.codebuddy/commands/splx/copy-test-request.md',
  'get-task': '.codebuddy/commands/splx/get-task.md',
  'implement': '.codebuddy/commands/splx/implement.md',
  'orchestrate': '.codebuddy/commands/splx/orchestrate.md',
  'parse-feedback': '.codebuddy/commands/splx/parse-feedback.md',
  'plan-implementation': '.codebuddy/commands/splx/plan-implementation.md',
  'plan-proposal': '.codebuddy/commands/splx/plan-proposal.md',
  'plan-request': '.codebuddy/commands/splx/plan-request.md',
  'prepare-compact': '.codebuddy/commands/splx/prepare-compact.md',
  'prepare-release': '.codebuddy/commands/splx/prepare-release.md',
  'refine-architecture': '.codebuddy/commands/splx/refine-architecture.md',
  'refine-release': '.codebuddy/commands/splx/refine-release.md',
  'refine-review': '.codebuddy/commands/splx/refine-review.md',
  'refine-testing': '.codebuddy/commands/splx/refine-testing.md',
  'review': '.codebuddy/commands/splx/review.md',
  'sync-tasks': '.codebuddy/commands/splx/sync-tasks.md',
  'sync-workspace': '.codebuddy/commands/splx/sync-workspace.md',
  'test': '.codebuddy/commands/splx/test.md',
  'undo-task': '.codebuddy/commands/splx/undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
name: Archive
description: Archive a deployed change and update specs.
category: OpenSplx
tags: [splx, archive]
---`,
  'complete-task': `---
name: Complete Task
description: Mark a task as done.
category: OpenSplx
tags: [splx, task, workflow]
---`,
  'copy-next-task': `---
name: Copy Next Task
description: Copy next task or feedback block to clipboard for external agent handoff.
category: OpenSplx
tags: [splx, orchestrate, workflow]
---`,
  'copy-review-request': `---
name: Copy Review Request
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
category: OpenSplx
tags: [splx, review, workflow]
---`,
  'copy-test-request': `---
name: Copy Test Request
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
category: OpenSplx
tags: [splx, testing, workflow]
---`,
  'get-task': `---
name: Get Task
description: Select and display the next prioritized task to work on.
category: OpenSplx
tags: [splx, task, workflow]
---`,
  'implement': `---
name: Implement
description: Implement an approved change and keep tasks in sync.
category: OpenSplx
tags: [splx, implement]
---`,
  'orchestrate': `---
name: Orchestrate
description: Orchestrate sub-agents to complete work collaboratively.
category: OpenSplx
tags: [splx, orchestrate, sub-agents]
---`,
  'parse-feedback': `---
name: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: OpenSplx
tags: [splx, review, workflow]
---`,
  'plan-implementation': `---
name: Plan Implementation
description: Orchestrate multi-agent task handoff for a change.
category: OpenSplx
tags: [splx, orchestrate, workflow]
---`,
  'plan-proposal': `---
name: Plan Proposal
description: Scaffold a new change and validate strictly. Consumes request.md when present.
category: OpenSplx
tags: [splx, change]
---`,
  'plan-request': `---
name: Plan Request
description: Clarify user intent through iterative yes/no questions before proposal creation.
category: OpenSplx
tags: [splx, change, planning]
---`,
  'prepare-compact': `---
name: Prepare Compact
description: Preserve session progress for context continuity.
category: OpenSplx
tags: [splx, context, session]
---`,
  'prepare-release': `---
name: Prepare Release
description: Prepare release by updating changelog, readme, and architecture documentation.
category: OpenSplx
tags: [splx, release, documentation]
---`,
  'refine-architecture': `---
name: Refine Architecture
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
category: OpenSplx
tags: [splx, architecture, documentation]
---`,
  'refine-release': `---
name: Refine Release
description: Create or update RELEASE.md.
category: OpenSplx
tags: [splx, release, documentation]
---`,
  'refine-review': `---
name: Refine Review
description: Create or update REVIEW.md.
category: OpenSplx
tags: [splx, review, documentation]
---`,
  'refine-testing': `---
name: Refine Testing
description: Create or update TESTING.md.
category: OpenSplx
tags: [splx, testing, documentation]
---`,
  'review': `---
name: Review
description: Review implementations against specs, changes, or tasks.
category: OpenSplx
tags: [splx, review, workflow]
---`,
  'sync-tasks': `---
name: Sync Tasks
description: Sync tasks with external project management tools via MCPs (Linear, GitHub, Jira).
category: OpenSplx
tags: [splx, sync, external, mcp]
---`,
  'sync-workspace': `---
name: Sync Workspace
description: Scan workspace state and suggest maintenance actions.
category: OpenSplx
tags: [splx, workspace, maintenance]
---`,
  'test': `---
name: Test
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
category: OpenSplx
tags: [splx, testing, workflow]
---`,
  'undo-task': `---
name: Undo Task
description: Revert a task to to-do.
category: OpenSplx
tags: [splx, task, workflow]
---`
};

export class CodeBuddySlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codebuddy';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string {
    return FRONTMATTER[id];
  }
}
