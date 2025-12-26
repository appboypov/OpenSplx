---
status: to-do
---

# Task: Verify all acceptance criteria with tests

## End Goal

All PLX-15 acceptance criteria are verified with tests and manual verification.

## Currently

N/A - verification task.

## Should

- All tests pass
- All acceptance criteria from PLX-15 are met
- Both `openspec` and `plx` CLI names work

## Constraints

- [ ] Do not proceed if tests fail
- [ ] Fix any issues found during verification

## Acceptance Criteria

- [ ] User can fetch a specific task by providing its filename without extension
- [ ] User can fetch a specific change or spec by ID
- [ ] User can filter task output to show only constraints section
- [ ] User can filter task output to show only acceptance criteria section
- [ ] User can combine filter flags to show multiple sections
- [ ] User can view all tasks for a specific change
- [ ] User can view all open tasks in the project
- [ ] All new commands appear in generated AGENTS.md files
- [ ] Help text and shell completions reflect the new flags and commands

## Implementation Checklist

- [ ] 5.1 Run `pnpm build` and verify no TypeScript errors
- [ ] 5.2 Run `pnpm test` and verify all tests pass
- [ ] 5.3 Run `pnpm lint` and fix any lint errors
- [ ] 5.4 Manual test: `openspec get task --id <id>`
- [ ] 5.5 Manual test: `openspec get task --constraints`
- [ ] 5.6 Manual test: `openspec get task --constraints --acceptance-criteria`
- [ ] 5.7 Manual test: `openspec get change --id <id>`
- [ ] 5.8 Manual test: `openspec get spec --id <id>`
- [ ] 5.9 Manual test: `openspec get tasks`
- [ ] 5.10 Manual test: `openspec get tasks --id <change-id>`
- [ ] 5.11 Verify shell completions work
- [ ] 5.12 Verify AGENTS.md includes new commands

## Notes

Test with both `openspec` and `plx` CLI names to ensure alias works.
