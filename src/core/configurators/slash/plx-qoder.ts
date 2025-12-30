import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.qoder/commands/plx/get-task.md',
  'orchestrate': '.qoder/commands/plx/orchestrate.md',
  'parse-feedback': '.qoder/commands/plx/parse-feedback.md',
  'prepare-compact': '.qoder/commands/plx/prepare-compact.md',
  'prepare-release': '.qoder/commands/plx/prepare-release.md',
  'refine-architecture': '.qoder/commands/plx/refine-architecture.md',
  'refine-release': '.qoder/commands/plx/refine-release.md',
  'refine-review': '.qoder/commands/plx/refine-review.md',
  'review': '.qoder/commands/plx/review.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'get-task': `---
name: Pew Pew Plx: Get Task
description: Select and display the next prioritized task to work on.
category: Pew Pew Plx
tags: [plx, task, workflow]
---`,
  'orchestrate': `---
name: Pew Pew Plx: Orchestrate
description: Orchestrate sub-agents to complete work collaboratively.
category: Pew Pew Plx
tags: [plx, orchestrate, sub-agents]
---`,
  'parse-feedback': `---
name: Pew Pew Plx: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`,
  'prepare-compact': `---
name: Pew Pew Plx: Prepare Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: Pew Pew Plx
tags: [plx, context, session]
---`,
  'prepare-release': `---
name: Pew Pew Plx: Prepare Release
description: Prepare release by updating changelog, readme, and architecture documentation.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-architecture': `---
name: Pew Pew Plx: Refine Architecture
description: Create or update ARCHITECTURE.md.
category: Pew Pew Plx
tags: [plx, architecture, documentation]
---`,
  'refine-release': `---
name: Pew Pew Plx: Refine Release
description: Create or update RELEASE.md.
category: Pew Pew Plx
tags: [plx, release, documentation]
---`,
  'refine-review': `---
name: Pew Pew Plx: Refine Review
description: Create or update REVIEW.md.
category: Pew Pew Plx
tags: [plx, review, documentation]
---`,
  'review': `---
name: Pew Pew Plx: Review
description: Review implementations against specs, changes, or tasks.
category: Pew Pew Plx
tags: [plx, review, workflow]
---`
};

export class PlxQoderSlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'qoder';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
