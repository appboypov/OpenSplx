---
status: to-do
---

# Task: Extend get command with subcommands and flags

## End Goal

The `get` command has new subcommands (`change`, `spec`, `tasks`) and filter flags (`--id`, `--constraints`, `--acceptance-criteria`).

## Currently

- `get.ts` only has `task` subcommand
- No support for `--id` flag
- No content filtering flags

## Should

- `get task --id <task-id>` retrieves specific task
- `get task --constraints` filters to constraints section
- `get task --acceptance-criteria` filters to acceptance criteria section
- `get change --id <change-id>` retrieves change proposal
- `get spec --id <spec-id>` retrieves spec
- `get tasks` lists all open tasks
- `get tasks --id <change-id>` lists tasks for specific change

## Constraints

- [ ] Existing `get task` behavior must be preserved when `--id` not provided
- [ ] Wire up services from task 001
- [ ] Follow existing command patterns in `get.ts`

## Acceptance Criteria

- [ ] `plx get task --id 001-impl` displays task content
- [ ] `plx get task --constraints` shows only Constraints section
- [ ] `plx get task --constraints --acceptance-criteria` shows both sections
- [ ] `plx get change --id add-feature` displays change proposal
- [ ] `plx get spec --id user-auth` displays spec content
- [ ] `plx get tasks` displays summary table
- [ ] `plx get tasks --id add-feature` lists tasks for change
- [ ] All commands support `--json` flag
- [ ] Error messages clear when ID not found

## Implementation Checklist

- [ ] 2.1 Add `--id` option to `task` subcommand in `src/cli/index.ts`
- [ ] 2.2 Add `--constraints` flag to `task` subcommand
- [ ] 2.3 Add `--acceptance-criteria` flag to `task` subcommand
- [ ] 2.4 Update `TaskOptions` interface in `src/commands/get.ts`
- [ ] 2.5 Implement ID-based task retrieval in `GetCommand.task()`
- [ ] 2.6 Implement content filtering in `GetCommand.task()`
- [ ] 2.7 Add `change` subcommand with `--id` option
- [ ] 2.8 Implement `GetCommand.change()` method
- [ ] 2.9 Add `spec` subcommand with `--id` option
- [ ] 2.10 Implement `GetCommand.spec()` method
- [ ] 2.11 Add `tasks` subcommand with `--id` option
- [ ] 2.12 Implement `GetCommand.tasks()` method
- [ ] 2.13 Wire up ContentFilterService and ItemRetrievalService
- [ ] 2.14 Add integration tests for new subcommands

## Notes

Summary table format for `get tasks`: ID | Name | Status | Change
