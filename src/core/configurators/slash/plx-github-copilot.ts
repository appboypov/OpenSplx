import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.github/prompts/plx-get-task.prompt.md',
  'orchestrate': '.github/prompts/plx-orchestrate.prompt.md',
  'parse-feedback': '.github/prompts/plx-parse-feedback.prompt.md',
  'prepare-compact': '.github/prompts/plx-prepare-compact.prompt.md',
  'prepare-release': '.github/prompts/plx-prepare-release.prompt.md',
  'refine-architecture': '.github/prompts/plx-refine-architecture.prompt.md',
  'refine-release': '.github/prompts/plx-refine-release.prompt.md',
  'refine-review': '.github/prompts/plx-refine-review.prompt.md',
  'review': '.github/prompts/plx-review.prompt.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

$ARGUMENTS`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
---

$ARGUMENTS`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

$ARGUMENTS`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

$ARGUMENTS`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
---

$ARGUMENTS`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
---

$ARGUMENTS`,
  'refine-release': `---
description: Create or update RELEASE.md.
---

$ARGUMENTS`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

$ARGUMENTS`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

$ARGUMENTS`
};

export class PlxGitHubCopilotSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'github-copilot';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
