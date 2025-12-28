import { PlxSlashCommandConfigurator } from './plx-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'init-architecture': '.codebuddy/commands/plx/init-architecture.md',
  'update-architecture': '.codebuddy/commands/plx/update-architecture.md',
  'get-task': '.codebuddy/commands/plx/get-task.md',
  'compact': '.codebuddy/commands/plx/compact.md',
  'review': '.codebuddy/commands/plx/review.md',
  'refine-architecture': '.codebuddy/commands/plx/refine-architecture.md',
  'refine-review': '.codebuddy/commands/plx/refine-review.md',
  'parse-feedback': '.codebuddy/commands/plx/parse-feedback.md'
};

const FRONTMATTER: Record<PlxSlashCommandId, string> = {
  'init-architecture': `---
name: PLX: Init Architecture
description: Generate comprehensive ARCHITECTURE.md from codebase analysis.
category: PLX
tags: [plx, architecture, documentation]
---`,
  'update-architecture': `---
name: PLX: Update Architecture
description: Refresh ARCHITECTURE.md based on current codebase state.
category: PLX
tags: [plx, architecture, documentation]
---`,
  'get-task': `---
name: PLX: Get Task
description: Select and display the next prioritized task to work on.
category: PLX
tags: [plx, task, workflow]
---`,
  'compact': `---
name: PLX: Compact
description: Preserve session progress in PROGRESS.md for context continuity.
category: PLX
tags: [plx, context, session]
---`,
  'review': `---
name: PLX: Review
description: Review implementations against specs, changes, or tasks.
category: PLX
tags: [plx, review, workflow]
---`,
  'refine-architecture': `---
name: PLX: Refine Architecture
description: Create or update ARCHITECTURE.md.
category: PLX
tags: [plx, architecture, documentation]
---`,
  'refine-review': `---
name: PLX: Refine Review
description: Create or update REVIEW.md.
category: PLX
tags: [plx, review, documentation]
---`,
  'parse-feedback': `---
name: PLX: Parse Feedback
description: Parse feedback markers and generate review tasks.
category: PLX
tags: [plx, review, workflow]
---`
};

export class PlxCodeBuddySlashCommandConfigurator extends PlxSlashCommandConfigurator {
  readonly toolId = 'codebuddy';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getFrontmatter(id: PlxSlashCommandId): string {
    return FRONTMATTER[id];
  }
}
