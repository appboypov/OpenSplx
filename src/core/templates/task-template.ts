export interface TaskContext {
  title: string;
  skillLevel?: 'junior' | 'medior' | 'senior';
  parentType?: 'change' | 'review';
  parentId?: string;
  type?: string;
  blockedBy?: string[];
}

export const taskTemplate = (context: TaskContext): string => {
  let frontmatter = `---
status: to-do${context.skillLevel ? `\nskill-level: ${context.skillLevel}` : ''}${context.parentType ? `\nparent-type: ${context.parentType}` : ''}${context.parentId ? `\nparent-id: ${context.parentId}` : ''}${context.type ? `\ntype: ${context.type}` : ''}`;

  if (context.blockedBy && context.blockedBy.length > 0) {
    frontmatter += `\nblocked-by:\n${context.blockedBy.map(id => `  - ${id}`).join('\n')}`;
  }

  frontmatter += '\n---';

  return `${frontmatter}

# Task: ${context.title}

## End Goal
TBD - What this task accomplishes.

## Currently
TBD - Current state before this task.

## Should
TBD - Expected state after this task.

## Constraints
- [ ] TBD

## Acceptance Criteria
- [ ] TBD

## Implementation Checklist
- [ ] 1.1 TBD

## Notes
TBD - Additional context if needed.
`;
};
