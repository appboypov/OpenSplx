import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.amazonq/prompts/plx-get-task.md',
  'orchestrate': '.amazonq/prompts/plx-orchestrate.md',
  'parse-feedback': '.amazonq/prompts/plx-parse-feedback.md',
  'prepare-compact': '.amazonq/prompts/plx-prepare-compact.md',
  'prepare-release': '.amazonq/prompts/plx-prepare-release.md',
  'refine-architecture': '.amazonq/prompts/plx-refine-architecture.md',
  'refine-release': '.amazonq/prompts/plx-refine-release.md',
  'refine-review': '.amazonq/prompts/plx-refine-review.md',
  'review': '.amazonq/prompts/plx-review.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
description: Select and display the next prioritized task to work on.
---

<arguments>$ARGUMENTS</arguments>`,
  'orchestrate': `---
description: Orchestrate sub-agents to complete work collaboratively.
---

<arguments>$ARGUMENTS</arguments>`,
  'parse-feedback': `---
description: Parse feedback markers and generate review tasks.
---

<arguments>$ARGUMENTS</arguments>`,
  'prepare-compact': `---
description: Preserve session progress in PROGRESS.md for context continuity.
---

<arguments>$ARGUMENTS</arguments>`,
  'prepare-release': `---
description: Prepare release by updating changelog, readme, and architecture documentation.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-architecture': `---
description: Create or update ARCHITECTURE.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-release': `---
description: Create or update RELEASE.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'refine-review': `---
description: Create or update REVIEW.md.
---

<arguments>$ARGUMENTS</arguments>`,
  'review': `---
description: Review implementations against specs, changes, or tasks.
---

<arguments>$ARGUMENTS</arguments>`
};

export class PlxAmazonQSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'amazon-q';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
