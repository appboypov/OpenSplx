import path from 'path';
import os from 'os';
import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId, TemplateManager } from '../../templates/index.js';
import { FileSystemUtils } from '../../../utils/file-system.js';
import { PLX_MARKERS } from '../../config.js';

const FILE_PATHS: Record<SlashCommandId, string> = {
  'archive': '.codex/prompts/splx-archive.md',
  'complete-task': '.codex/prompts/splx-complete-task.md',
  'copy-next-task': '.codex/prompts/splx-copy-next-task.md',
  'copy-review-request': '.codex/prompts/splx-copy-review-request.md',
  'copy-test-request': '.codex/prompts/splx-copy-test-request.md',
  'get-task': '.codex/prompts/splx-get-task.md',
  'implement': '.codex/prompts/splx-implement.md',
  'orchestrate': '.codex/prompts/splx-orchestrate.md',
  'parse-feedback': '.codex/prompts/splx-parse-feedback.md',
  'plan-implementation': '.codex/prompts/splx-plan-implementation.md',
  'plan-proposal': '.codex/prompts/splx-plan-proposal.md',
  'plan-request': '.codex/prompts/splx-plan-request.md',
  'prepare-compact': '.codex/prompts/splx-prepare-compact.md',
  'prepare-release': '.codex/prompts/splx-prepare-release.md',
  'refine-architecture': '.codex/prompts/splx-refine-architecture.md',
  'refine-release': '.codex/prompts/splx-refine-release.md',
  'refine-review': '.codex/prompts/splx-refine-review.md',
  'refine-testing': '.codex/prompts/splx-refine-testing.md',
  'review': '.codex/prompts/splx-review.md',
  'sync-tasks': '.codex/prompts/splx-sync-tasks.md',
  'sync-workspace': '.codex/prompts/splx-sync-workspace.md',
  'test': '.codex/prompts/splx-test.md',
  'undo-task': '.codex/prompts/splx-undo-task.md'
};

const FRONTMATTER: Record<SlashCommandId, string> = {
  'archive': `---
description: Archive a deployed PLX change and update specs.
argument-hint: change-id
---

$ARGUMENTS`,
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
argument-hint: change-id
---

$ARGUMENTS`,
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
argument-hint: request or feature description
---

$ARGUMENTS`,
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

export class CodexSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'codex';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    return FRONTMATTER[id];
  }

  private getGlobalPromptsDir(): string {
    const home = (process.env.CODEX_HOME && process.env.CODEX_HOME.trim())
      ? process.env.CODEX_HOME.trim()
      : FileSystemUtils.joinPath(os.homedir(), '.codex');
    return FileSystemUtils.joinPath(home, 'prompts');
  }

  async generateAll(projectPath: string): Promise<string[]> {
    const createdOrUpdated: string[] = [];
    for (const target of this.getTargets()) {
      const body = TemplateManager.getSlashCommandBody(target.id).trim();
      const promptsDir = this.getGlobalPromptsDir();
      const filePath = FileSystemUtils.joinPath(
        promptsDir,
        path.basename(target.path)
      );

      await FileSystemUtils.createDirectory(path.dirname(filePath));

      if (await FileSystemUtils.fileExists(filePath)) {
        await this.updateFullFile(filePath, target.id, body);
      } else {
        const frontmatter = this.getFrontmatter(target.id);
        const sections: string[] = [];
        if (frontmatter) sections.push(frontmatter.trim());
        sections.push(`${PLX_MARKERS.start}\n${body}\n${PLX_MARKERS.end}`);
        await FileSystemUtils.writeFile(filePath, sections.join('\n') + '\n');
      }

      createdOrUpdated.push(target.path);
    }
    return createdOrUpdated;
  }

  async updateExisting(projectPath: string): Promise<string[]> {
    const updated: string[] = [];
    for (const target of this.getTargets()) {
      const promptsDir = this.getGlobalPromptsDir();
      const filePath = FileSystemUtils.joinPath(
        promptsDir,
        path.basename(target.path)
      );
      if (await FileSystemUtils.fileExists(filePath)) {
        const body = TemplateManager.getSlashCommandBody(target.id).trim();
        await this.updateFullFile(filePath, target.id, body);
        updated.push(target.path);
      }
    }
    return updated;
  }

  resolveAbsolutePath(_projectPath: string, id: SlashCommandId): string {
    const promptsDir = this.getGlobalPromptsDir();
    const fileName = path.basename(FILE_PATHS[id]);
    return FileSystemUtils.joinPath(promptsDir, fileName);
  }
}
