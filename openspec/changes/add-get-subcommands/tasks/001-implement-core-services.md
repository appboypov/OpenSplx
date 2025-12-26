---
status: to-do
---

# Task: Implement core services for item retrieval and content filtering

## End Goal

Create the foundational services that enable retrieving tasks, changes, and specs by ID, and filtering markdown content by section.

## Currently

- `get.ts` only supports prioritized task retrieval
- No service exists for retrieving items by ID
- No utility exists for extracting specific markdown sections

## Should

- `src/utils/markdown-sections.ts` utility for section extraction
- `src/services/content-filter.ts` ContentFilterService for filtering content
- `src/services/item-retrieval.ts` ItemRetrievalService for ID-based retrieval

## Constraints

- [ ] Reuse existing `task-file-parser.ts` for filename parsing
- [ ] Reuse existing `task-status.ts` for status parsing
- [ ] Follow patterns from `item-discovery.ts` for file system operations
- [ ] Section matching must be case-insensitive

## Acceptance Criteria

- [ ] `extractSection(content, sectionName)` returns section content with header
- [ ] `listSections(content)` returns array of section names
- [ ] `filterSections(content, sections[])` returns multiple sections combined
- [ ] `getTaskById(taskId)` searches all changes and returns first match
- [ ] `getChangeById(changeId)` returns change proposal and task list
- [ ] `getSpecById(specId)` returns spec content
- [ ] `getTasksForChange(changeId)` returns task summaries for a change
- [ ] `getAllOpenTasks()` returns all open tasks with change context
- [ ] Unit tests pass for all service methods

## Implementation Checklist

- [ ] 1.1 Create `src/utils/markdown-sections.ts` with `extractSection` function
- [ ] 1.2 Add `listSections` function to markdown-sections utility
- [ ] 1.3 Create `src/services/content-filter.ts` with ContentFilterService class
- [ ] 1.4 Implement `filterSections` method in ContentFilterService
- [ ] 1.5 Implement `filterMultipleTasks` method for aggregating from multiple tasks
- [ ] 1.6 Create `src/services/item-retrieval.ts` with ItemRetrievalService class
- [ ] 1.7 Implement `getTaskById` method
- [ ] 1.8 Implement `getChangeById` method
- [ ] 1.9 Implement `getSpecById` method
- [ ] 1.10 Implement `getTasksForChange` method
- [ ] 1.11 Implement `getAllOpenTasks` method
- [ ] 1.12 Add unit tests for markdown-sections utility
- [ ] 1.13 Add unit tests for ContentFilterService
- [ ] 1.14 Add unit tests for ItemRetrievalService

## Notes

Section regex pattern: `/^## (.+)$/gm` to find all level-2 headers.
