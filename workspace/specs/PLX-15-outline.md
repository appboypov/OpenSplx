# PLX-15 Outline Spec

## Issue Reference
- **Linear:** [PLX-15](https://linear.app/de-app-specialist/issue/PLX-15/user-can-retrieve-specific-items-and-filter-task-content-with-cli)
- **GitHub:** [#23](https://github.com/appboypov/OpenSplx/issues/23)
- **Parent Complexity:** 8 (Complex)

---

## Expert Judgment

| Criteria | Answer | Reasoning |
|----------|--------|-----------|
| Can it be tested and delivered as one piece? | NO | 5 distinct phases with different concerns |
| Is the scope clear and bounded? | YES | Well-defined in refine spec |
| Can it be completed without intermediate checkpoints? | NO | Each phase produces testable output |

**Decision:** Split into 5 sub-issues following the implementation phases from the refine spec.

---

## Proposed Sub-Issues

### Sub-Issue 1: Core Services for Item Retrieval and Content Filtering

**Type:** task
**Title:** Implement core services for item retrieval and content filtering
**Complexity:** 4
**Labels:** backend

**Description:**

## End Goal

Create the foundational services that enable retrieving tasks, changes, and specs by ID, and filtering markdown content by section.

## Deliverables

1. `src/utils/markdown-sections.ts` - Section extraction utility
   - `extractSection(content, sectionName)` - Extract single section
   - `listSections(content)` - List all section names

2. `src/services/content-filter.ts` - ContentFilterService
   - `filterSections(content, sections[])` - Extract multiple sections
   - `filterMultipleTasks(taskContents[], sections[])` - Aggregate from multiple tasks

3. `src/services/item-retrieval.ts` - ItemRetrievalService
   - `getTaskById(taskId, changeId?)` - Retrieve task by ID
   - `getChangeById(changeId)` - Retrieve change proposal
   - `getSpecById(specId)` - Retrieve spec
   - `getTasksForChange(changeId)` - List tasks for change
   - `getAllOpenTasks()` - List all open tasks

## Acceptance Criteria

- [ ] markdown-sections utility extracts sections case-insensitively
- [ ] ContentFilterService returns empty string for non-existent sections
- [ ] ItemRetrievalService searches all changes when no changeId provided
- [ ] Unit tests pass for all service methods
- [ ] Services follow existing codebase patterns

## Technical Notes

- Use existing `task-file-parser.ts` for filename parsing
- Use existing `task-status.ts` for status parsing
- Follow patterns from `item-discovery.ts` for file system operations

---

### Sub-Issue 2: Get Command Subcommands and Flags

**Type:** task
**Title:** Extend get command with subcommands and filter flags
**Complexity:** 4
**Labels:** backend
**Blocked By:** Sub-Issue 1

**Description:**

## End Goal

Extend `src/commands/get.ts` with new subcommands (`change`, `spec`, `tasks`) and filter flags (`--id`, `--constraints`, `--acceptance-criteria`).

## Deliverables

1. `plx get task --id <task-id>` - Retrieve specific task
2. `plx get task --constraints` - Filter to constraints only
3. `plx get task --acceptance-criteria` - Filter to acceptance criteria only
4. `plx get change --id <change-id>` - Retrieve change proposal
5. `plx get change --constraints --acceptance-criteria` - Filter change tasks
6. `plx get spec --id <spec-id>` - Retrieve spec
7. `plx get tasks` - List all open tasks (summary table)
8. `plx get tasks --id <change-id>` - List tasks for specific change

## Acceptance Criteria

- [ ] All subcommands registered with commander
- [ ] `--json` flag works for all subcommands
- [ ] Filter flags can be combined
- [ ] Error messages clear when ID not found
- [ ] Existing `plx get task` behavior preserved (prioritized task retrieval)

## Technical Notes

- Wire up ContentFilterService and ItemRetrievalService
- Follow existing command patterns in `get.ts`
- Summary table format: ID | Name | Status | Change

---

### Sub-Issue 3: Shell Completion Registry Update

**Type:** task
**Title:** Add get command to shell completion registry
**Complexity:** 2
**Labels:** backend
**Blocked By:** Sub-Issue 2

**Description:**

## End Goal

Add `get` command with all subcommands and flags to `COMMAND_REGISTRY` for shell autocompletion.

## Deliverables

1. Update `src/core/completions/command-registry.ts`
   - Add `get` command definition
   - Add `task`, `change`, `spec`, `tasks` subcommands
   - Add all flags with descriptions and value requirements

2. Dynamic completion for IDs
   - Task IDs from all changes
   - Change IDs from active changes
   - Spec IDs from specs directory

## Acceptance Criteria

- [ ] `plx get <TAB>` shows task, change, spec, tasks
- [ ] `plx get task --<TAB>` shows all flags
- [ ] `plx get change --id <TAB>` shows available change IDs
- [ ] Completion scripts regenerate correctly

## Technical Notes

- Follow existing `COMMAND_REGISTRY` patterns
- Use `positionalType` for ID completion
- Test with `plx completion generate zsh`

---

### Sub-Issue 4: AGENTS.md Template Documentation

**Type:** task
**Title:** Update AGENTS.md template with get commands documentation
**Complexity:** 2
**Labels:** backend
**Blocked By:** Sub-Issue 2

**Description:**

## End Goal

Update `src/core/templates/agents-template.ts` to include documentation for all new get commands.

## Deliverables

1. Add to CLI Commands section:
   ```
   openspec get task [--id ID] [--constraints] [--acceptance-criteria]
   openspec get change --id ID [--constraints] [--acceptance-criteria]
   openspec get spec --id ID
   openspec get tasks [--id CHANGE_ID]
   ```

2. Add usage examples showing common patterns

3. Run `plx update` to propagate to all configurators

## Acceptance Criteria

- [ ] All get commands documented in AGENTS.md template
- [ ] Filter flags explained with examples
- [ ] Documentation follows existing style
- [ ] `plx init` creates AGENTS.md with new commands
- [ ] `plx update` updates existing projects

## Technical Notes

- Integrate into existing CLI Commands section (per refine decision)
- Ensure template escaping is correct for backticks
- Test with fresh `plx init` project

---

### Sub-Issue 5: Integration Testing and Verification

**Type:** task
**Title:** Verify all acceptance criteria with integration tests
**Complexity:** 2
**Labels:** backend
**Blocked By:** Sub-Issues 1-4

**Description:**

## End Goal

Verify all acceptance criteria from PLX-15 are met with integration tests.

## Deliverables

1. E2E tests for task retrieval by ID
2. E2E tests for content filtering
3. E2E tests for change and spec retrieval
4. E2E tests for tasks listing
5. Shell completion verification
6. Documentation generation verification

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

## Technical Notes

- Run tests in isolated project directory
- Verify both `openspec` and `plx` CLI names work
- Test JSON output format

---

## Summary

| # | Title | Type | Complexity | Blocked By |
|---|-------|------|------------|------------|
| 1 | Core services for item retrieval and content filtering | task | 4 | - |
| 2 | Extend get command with subcommands and filter flags | task | 4 | 1 |
| 3 | Add get command to shell completion registry | task | 2 | 2 |
| 4 | Update AGENTS.md template with get commands documentation | task | 2 | 2 |
| 5 | Verify all acceptance criteria with integration tests | task | 2 | 1-4 |

**Total Complexity:** 14 (vs parent 8 - split reveals hidden complexity in testing and docs)

---

## Decisions

- Split into 5 implementation phases matching the refine spec
- Phases 3 and 4 can run in parallel after phase 2
- Phase 5 depends on all others and serves as final verification
- Each phase is independently testable and deliverable
- **Delivery approach:** Task phases documented as comments on parent issue (not separate Linear issues)

