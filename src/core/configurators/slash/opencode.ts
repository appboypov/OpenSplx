import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { PLX_MARKERS } from '../../config.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.opencode/command/splx-archive.md',
  'complete-task': '.opencode/command/splx-complete-task.md',
  'copy-next-task': '.opencode/command/splx-copy-next-task.md',
  'copy-review-request': '.opencode/command/splx-copy-review-request.md',
  'copy-test-request': '.opencode/command/splx-copy-test-request.md',
  'get-task': '.opencode/command/splx-get-task.md',
  'implement': '.opencode/command/splx-implement.md',
  'orchestrate': '.opencode/command/splx-orchestrate.md',
  'parse-feedback': '.opencode/command/splx-parse-feedback.md',
  'plan-implementation': '.opencode/command/splx-plan-implementation.md',
  'plan-proposal': '.opencode/command/splx-plan-proposal.md',
  'plan-request': '.opencode/command/splx-plan-request.md',
  'prepare-compact': '.opencode/command/splx-prepare-compact.md',
  'prepare-release': '.opencode/command/splx-prepare-release.md',
  'refine-architecture': '.opencode/command/splx-refine-architecture.md',
  'refine-release': '.opencode/command/splx-refine-release.md',
  'refine-review': '.opencode/command/splx-refine-review.md',
  'refine-testing': '.opencode/command/splx-refine-testing.md',
  'review': '.opencode/command/splx-review.md',
  'sync-tasks': '.opencode/command/splx-sync-tasks.md',
  'sync-workspace': '.opencode/command/splx-sync-workspace.md',
  'test': '.opencode/command/splx-test.md',
  'undo-task': '.opencode/command/splx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
---
<ChangeId>
  $ARGUMENTS
</ChangeId>
`,
  'complete-task': `---
description: Mark a task as done.
argument-hint: task-id
---

$ARGUMENTS`,
  'copy-next-task': `---
description: Copy next task or feedback block to clipboard for external agent handoff.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'copy-review-request': `---
description: Copy review request block with REVIEW.md guidelines to clipboard for external agent.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'copy-test-request': `---
description: Copy test request block with TESTING.md configuration to clipboard for external agent.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'get-task': `---
description: Select and display the next prioritized task to work on.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'implement': `---
description: Implement an approved PLX change and keep tasks in sync.
---
The user has requested to implement the following change proposal. Find the change proposal and follow the instructions below. If you're not sure or if ambiguous, ask for clarification from the user.
<UserRequest>
  $ARGUMENTS
</UserRequest>
`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'plan-implementation': `---
description: Orchestrate multi-agent task handoff for a change.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'plan-proposal': `---
description: Scaffold a new PLX change and validate strictly. Consumes request.md when present.
---
The user has requested the following change proposal. Use the PLX instructions to create their change proposal.
<UserRequest>
  $ARGUMENTS
</UserRequest>
`,
  'plan-request': `---
description: Clarify user intent through iterative yes/no questions before proposal creation.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'prepare-compact': `---
description: Preserve session progress for context continuity.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md with spec-ready component inventories.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-release': `---
description: Create or update RELEASE.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'refine-testing': `---
description: Create or update TESTING.md.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
argument-hint: (optional context)
---

$ARGUMENTS`,
  'sync-tasks': `---
description: Sync tasks with external project management tools via MCPs (Linear, GitHub, Jira).
argument-hint: change-id
---

$ARGUMENTS`,
  'sync-workspace': `---
description: Scan workspace state and suggest maintenance actions.
argument-hint: --id <id> --parent-type change|task
---

$ARGUMENTS`,
  'test': `---
description: Run tests based on scope (change, task, or spec) using TESTING.md configuration.
argument-hint: --id <id> --parent-type change|task|spec
---

$ARGUMENTS`,
  'undo-task': `---
description: Revert a task to to-do.
argument-hint: task-id
---

$ARGUMENTS`
};

export class OpenCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'opencode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated = await super.generateAll(projectPath);
    await this.rewriteArchiveFile(projectPath);
    return createdOrUpdated;
  }

  async updateExisting(projectPath: string): Promise<string[]> {
    const updated = await super.updateExisting(projectPath);
    const rewroteArchive = await this.rewriteArchiveFile(projectPath);
    if (rewroteArchive && !updated.includes(FILE_PATHS.archive)) {
      updated.push(FILE_PATHS.archive);
    }
    return updated;
  }

  private async rewriteArchiveFile(projectPath: string): Promise<boolean> {
    const archivePath = FileSystemUtils.joinPath(projectPath, FILE_PATHS.archive);
    if (!await FileSystemUtils.fileExists(archivePath)) {
      return false;
    }

    const body = this.getBody('archive');
    const frontmatter = this.getFrontmatter('archive');
    const sections: string[] = [];

    if (frontmatter) {
      sections.push(frontmatter.trim());
    }

    sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);
    await FileSystemUtils.writeFile(archivePath, sections.join('\n') + '\n');
    return true;
  }
}
