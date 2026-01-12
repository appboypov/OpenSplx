---
status: in-progress
skill-level: medior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Rename All Code References

## End Goal

All occurrences of "OpenSplx", "splx", and "Splx" in source code, templates, and documentation are renamed to "OpenSplx" and "splx".

## Currently

- Source files contain references to "OpenSplx", "splx", "Splx"
- Templates contain hardcoded references
- Documentation files contain old branding
- Command name utilities reference "splx"

## Should

- All source files use "OpenSplx" and "splx"
- All templates use "OpenSplx" and "splx"
- All documentation uses "OpenSplx" and "splx"
- Command name detection uses "splx"

## Constraints

- [ ] Must preserve functionality (only rename, no logic changes)
- [ ] Must update all file paths if they contain "splx"
- [ ] Must update all string literals
- [ ] Must update all comments and documentation strings
- [ ] Must be careful with regex patterns that might match "splx" in other contexts

## Acceptance Criteria

- [ ] All source files in `src/` updated
- [ ] All template files in `src/core/templates/` updated
- [ ] All documentation files (README.md, ARCHITECTURE.md, AGENTS.md, etc.) updated
- [ ] Command name utilities (`src/utils/command-name.ts`) updated
- [ ] All test files updated
- [ ] No remaining references to "OpenSplx" or "splx" (except in historical context if needed)
- [ ] Build succeeds after changes
- [ ] Tests pass after changes

## Implementation Checklist

- [ ] 3.1 Search for all occurrences of "OpenSplx" and replace with "OpenSplx"
- [ ] 3.2 Search for all occurrences of "splx" (case-sensitive) and replace with "splx" in command contexts
- [ ] 3.3 Search for all occurrences of "Splx" and replace with "OpenSplx" or "splx" as appropriate
- [ ] 3.4 Update `src/utils/command-name.ts` to detect "splx" instead of "splx"
- [ ] 3.5 Update all template files in `src/core/templates/`
- [ ] 3.6 Update README.md
- [ ] 3.7 Update ARCHITECTURE.md
- [ ] 3.8 Update workspace/AGENTS.md
- [ ] 3.9 Update all spec files that reference the command
- [ ] 3.10 Update all test files
- [ ] 3.11 Update package.json scripts if they reference "splx"
- [ ] 3.12 Verify build succeeds
- [ ] 3.13 Verify tests pass

## Notes

Use grep/ripgrep to find all occurrences. Be careful with:
- File paths that might contain "splx"
- Regex patterns
- URLs and package names
- Comments that might reference historical context

Consider using a systematic approach: search and replace in batches by file type.
