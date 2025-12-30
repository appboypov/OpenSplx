import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.iflow/commands/plx-get-task.md',
  'orchestrate': '.iflow/commands/plx-orchestrate.md',
  'parse-feedback': '.iflow/commands/plx-parse-feedback.md',
  'prepare-compact': '.iflow/commands/plx-prepare-compact.md',
  'prepare-release': '.iflow/commands/plx-prepare-release.md',
  'refine-architecture': '.iflow/commands/plx-refine-architecture.md',
  'refine-release': '.iflow/commands/plx-refine-release.md',
  'refine-review': '.iflow/commands/plx-refine-review.md',
  'review': '.iflow/commands/plx-review.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
name: /plx-get-task
id: plx-get-task
category: Pew Pew Plx
description: Select and display the next prioritized task to work on.
---`,
  'orchestrate': `---
name: /plx-orchestrate
id: plx-orchestrate
category: Pew Pew Plx
description: Orchestrate sub-agents to complete work collaboratively.
---`,
  'parse-feedback': `---
name: /plx-parse-feedback
id: plx-parse-feedback
category: Pew Pew Plx
description: Parse feedback markers and generate review tasks.
---`,
  'prepare-compact': `---
name: /plx-prepare-compact
id: plx-prepare-compact
category: Pew Pew Plx
description: Preserve session progress in PROGRESS.md for context continuity.
---`,
  'prepare-release': `---
name: /plx-prepare-release
id: plx-prepare-release
category: Pew Pew Plx
description: Prepare release by updating changelog, readme, and architecture documentation.
---`,
  'refine-architecture': `---
name: /plx-refine-architecture
id: plx-refine-architecture
category: Pew Pew Plx
description: Create or update ARCHITECTURE.md.
---`,
  'refine-release': `---
name: /plx-refine-release
id: plx-refine-release
category: Pew Pew Plx
description: Create or update RELEASE.md.
---`,
  'refine-review': `---
name: /plx-refine-review
id: plx-refine-review
category: Pew Pew Plx
description: Create or update REVIEW.md.
---`,
  'review': `---
name: /plx-review
id: plx-review
category: Pew Pew Plx
description: Review implementations against specs, changes, or tasks.
---`
};

export class PlxIflowSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'iflow';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
