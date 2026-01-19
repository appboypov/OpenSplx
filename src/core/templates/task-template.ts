import { buildTaskFrontmatter, KNOWN_TEMPLATE_TYPES } from '../../utils/task-utils.js';

export interface TaskContext {
  title: string;
  skillLevel?: 'junior' | 'medior' | 'senior';
  parentType?: 'change' | 'review';
  parentId?: string;
  type?: string;
  blockedBy?: string[];
}

/**
 * Generates task frontmatter only. Body content must come from workspace/templates/<type>.md.
 * This is a fallback that should rarely be used - prefer using --type to specify a template.
 */
export const taskTemplate = (context: TaskContext): string => {
  const frontmatter = buildTaskFrontmatter({
    status: 'to-do',
    skillLevel: context.skillLevel,
    parentType: context.parentType,
    parentId: context.parentId,
    type: context.type,
    blockedBy: context.blockedBy,
  });

  const availableTypes = KNOWN_TEMPLATE_TYPES.join(', ');

  return `${frontmatter}

# Task: ${context.title}

⚠️ **No template type specified.** Use \`--type <type>\` to create a task with proper structure.

Available types: ${availableTypes}

Example: \`splx create task "My task" --parent-id my-change --type implementation\`
`;
};
