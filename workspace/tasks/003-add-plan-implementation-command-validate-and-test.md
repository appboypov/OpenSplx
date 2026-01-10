---
status: to-do
skill-level: medior
parent-type: change
parent-id: add-plan-implementation-command
---

# Task: Validate and Test

## End Goal

All changes pass validation, tests exist and pass, and the workflow is manually verified.

## Currently

- CLI command and slash command are implemented
- No tests exist for new functionality
- Not yet validated against specs

## Should

- Unit tests for `createProgress` method
- Integration tests for CLI command
- All validation passes (`plx validate change --id add-plan-implementation-command --strict`)
- Manual testing confirms workflow works

## Constraints

- [ ] Must follow existing test patterns in `test/commands/`
- [ ] Tests must not require external services
- [ ] Must use test utilities from `test/test-utils.ts`

## Acceptance Criteria

- [ ] `plx validate change --id add-plan-implementation-command --strict` passes
- [ ] `pnpm test` passes with new tests
- [ ] `pnpm build` succeeds
- [ ] Manual test: `plx create progress --change-id <test-change>` creates valid PROGRESS.md
- [ ] Manual test: Task blocks contain full context
- [ ] Manual test: Agent instructions do not mention PROGRESS.md

## Implementation Checklist

- [ ] 3.1 Create `test/commands/create-progress.test.ts`
- [ ] 3.2 Add test for successful progress creation
- [ ] 3.3 Add test for filtering completed tasks
- [ ] 3.4 Add test for change not found error
- [ ] 3.5 Add test for all tasks complete error
- [ ] 3.6 Add test for JSON output format
- [ ] 3.7 Run `plx validate change --id add-plan-implementation-command --strict`
- [ ] 3.8 Fix any validation errors
- [ ] 3.9 Run `pnpm test` and fix failures
- [ ] 3.10 Run `pnpm build` and fix errors
- [ ] 3.11 Manual test with a real change

## Notes

Use `createValidPlxWorkspace` helper from test-utils.ts to set up test fixtures.
