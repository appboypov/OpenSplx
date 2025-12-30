export type PlxSlashCommandId =
  | 'get-task'
  | 'orchestrate'
  | 'parse-feedback'
  | 'prepare-compact'
  | 'prepare-release'
  | 'refine-architecture'
  | 'refine-release'
  | 'refine-review'
  | 'review';

const getTaskGuardrails = `**Guardrails**
- Complete tasks sequentially, marking each done before starting the next.
- Tasks auto-transition from to-do to in-progress when retrieved.
- Preserve existing task file content when updating status.`;

const getTaskSteps = `**Steps**
1. Run \`plx get task\` to get the highest-priority task (auto-transitions to in-progress).
2. Execute the task following its Implementation Checklist.
3. When all checklist items are complete, run \`plx complete task --id <task-id>\` to mark the task as done.
4. **Stop and await user confirmation** before proceeding to the next task.`;

const prepareCompactGuardrails = `**Guardrails**
- Save ALL modified files before creating PROGRESS.md.
- Create PROGRESS.md in the project root directory.
- Include enough detail that a new agent can continue without user re-explanation.
- Add PROGRESS.md to .gitignore if not already present.
- Update existing PROGRESS.md if one already exists (don't create duplicates).`;

const prepareCompactSteps = `**Steps**
1. Save all files you have modified during this session.
2. Create or update \`PROGRESS.md\` in the project root with these sections: Current Task, Status, Completed Steps, Remaining Steps, Key Decisions Made, Files Modified, Files Created, Open Questions/Blockers, Context for Next Agent, Related Resources.
3. Check if \`.gitignore\` contains \`PROGRESS.md\`; if not present, add it on a new line.
4. Confirm to user that progress has been saved and they can start a new session.`;

const reviewGuardrails = `**Guardrails**
- Use CLI to retrieve review context.
- Output feedback as language-aware markers.
- Include parent linkage in markers when reviewing a task, change, or spec.`;

const reviewSteps = `**Steps**
1. Run \`plx review --change-id <id>\` (or --spec-id, --task-id).
2. Read the output: @REVIEW.md guidelines + parent documents.
3. Review implementation against constraints/acceptance criteria.
4. Insert feedback markers with format: \`#FEEDBACK #TODO | {type}:{id} | {feedback}\`
   - Examples: \`task:001\`, \`change:my-feature\`, \`spec:auth-spec\`
   - Parent linkage is optional but recommended.
5. Summarize findings.
6. Instruct to run \`plx parse feedback <name>\` (optionally with --change-id, --spec-id, or --task-id for unassigned markers).`;

const refineArchitectureGuardrails = `**Guardrails**
- Reference @ARCHITECTURE.md template structure.
- Focus on practical documentation.
- Preserve user content.`;

const refineArchitectureSteps = `**Steps**
1. Check if @ARCHITECTURE.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const refineReviewGuardrails = `**Guardrails**
- Reference @REVIEW.md template structure.
- Preserve existing guidelines.`;

const refineReviewSteps = `**Steps**
1. Check if @REVIEW.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const parseFeedbackGuardrails = `**Guardrails**
- Scan only tracked files.
- Generate one task per marker.
- Markers with parent linkage are grouped automatically.`;

const parseFeedbackSteps = `**Steps**
1. Run \`plx parse feedback <name>\` (CLI flags --change-id, --spec-id, --task-id are optional fallbacks for unassigned markers).
2. Review generated tasks.
3. Address feedback.
4. Archive when complete.`;

const refineReleaseGuardrails = `**Guardrails**
- Reference @RELEASE.md template structure.
- Preserve existing release configuration.`;

const refineReleaseSteps = `**Steps**
1. Check if @RELEASE.md exists.
2. If not: create from template.
3. If exists: read and update.`;

const prepareReleaseGuardrails = `**Guardrails**
- Read @RELEASE.md for full release preparation instructions.
- Reference @README.md, @CHANGELOG.md, and @ARCHITECTURE.md for updates.
- Execute steps sequentially: changelog → readme → architecture.
- User confirms or skips each step before proceeding.
- Preserve existing content when updating files.`;

const prepareReleaseSteps = `**Steps**
1. Read @RELEASE.md to understand release preparation workflow.
2. Execute changelog update step (source, version, format selection).
3. Execute readme update step (style, sections, badges selection).
4. Execute architecture update step (refresh from codebase).
5. Present summary of all changes made.`;

const orchestrateGuardrails = `**Guardrails**
- Spawn exactly one sub-agent per task—never parallelize task execution.
- Review each sub-agent's work before accepting it.
- Maintain ongoing conversations with sub-agents; don't just spawn and forget.
- Act as a senior team member guiding talented colleagues.
- Enforce TracelessChanges:
  - No comments referencing removed code.
  - No "we don't do X" statements about removed features.
  - No clarifications about previous states or deprecated behavior.
- Verify scope adherence: confirm no unnecessary additions.
- Verify project convention alignment before accepting work.`;

const orchestrateSteps = `**Steps**
1. Understand the work scope:
   - For changes: run \`plx get tasks\` to see all tasks.
   - For reviews: identify review aspects (architecture, scope, testing, etc.).
   - For other work: enumerate the discrete units of work.
2. For each unit of work:
   a. Get detailed context (\`plx get task --id <id>\` or equivalent).
   b. Spawn a sub-agent with clear, scoped instructions.
   c. Wait for sub-agent to complete work.
3. Review sub-agent output:
   - Scope adherence: no unrequested features or changes.
   - Convention alignment: follows project patterns and standards.
   - TracelessChanges: no artifacts of prior implementation.
   - Quality: meets acceptance criteria.
4. If issues found:
   - Provide specific, actionable feedback to sub-agent.
   - Request revision with clear guidance.
   - Repeat review until satisfactory.
5. If approved:
   - For tasks: mark complete with \`plx complete task --id <id>\`.
   - For reviews: consolidate feedback.
   - Proceed to next unit of work.
6. Continue until all work is complete.
7. Final validation: run \`plx validate\` if applicable.`;

const orchestrateReference = `**Reference**
- Use \`plx show <change-id>\` for proposal context.
- Use \`plx list\` to see all changes and progress.
- Use \`plx review\` for review context.
- Use \`plx parse feedback\` to convert review feedback to tasks.`;

export const plxSlashCommandBodies: Record<PlxSlashCommandId, string> = {
  'get-task': [getTaskGuardrails, getTaskSteps].join('\n\n'),
  'orchestrate': [orchestrateGuardrails, orchestrateSteps, orchestrateReference].join('\n\n'),
  'parse-feedback': [parseFeedbackGuardrails, parseFeedbackSteps].join('\n\n'),
  'prepare-compact': [prepareCompactGuardrails, prepareCompactSteps].join('\n\n'),
  'prepare-release': [prepareReleaseGuardrails, prepareReleaseSteps].join('\n\n'),
  'refine-architecture': [refineArchitectureGuardrails, refineArchitectureSteps].join('\n\n'),
  'refine-release': [refineReleaseGuardrails, refineReleaseSteps].join('\n\n'),
  'refine-review': [refineReviewGuardrails, refineReviewSteps].join('\n\n'),
  'review': [reviewGuardrails, reviewSteps].join('\n\n')
};

export function getPlxSlashCommandBody(id: PlxSlashCommandId): string {
  return plxSlashCommandBodies[id];
}
