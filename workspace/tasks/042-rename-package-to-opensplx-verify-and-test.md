---
status: to-do
skill-level: medior
parent-type: change
parent-id: rename-package-to-opensplx
---

# Task: Verify and Test Rename

## End Goal

All changes are verified, tests pass, and the renamed package works correctly.

## Currently

- All rename changes are implemented
- Need to verify everything works

## Should

- All tests pass
- Build succeeds
- CLI command `splx` works correctly
- Package can be installed and used
- No remaining references to old names (except in historical context)
- Validation passes

## Constraints

- [ ] Must run full test suite
- [ ] Must verify CLI functionality
- [ ] Must check for any missed references
- [ ] Must validate package can be published

## Acceptance Criteria

- [ ] `pnpm test` passes
- [ ] `pnpm build` succeeds
- [ ] `splx --version` works
- [ ] `splx init` works (test in temp directory)
- [ ] `splx validate change --id rename-package-to-opensplx --strict` passes
- [ ] No remaining "OpenSplx" or "splx" references in code (except historical)
- [ ] Package.json is valid
- [ ] Git config is correct
- [ ] Documentation is consistent

## Implementation Checklist

- [ ] 7.1 Run `pnpm build` and verify success
- [ ] 7.2 Run `pnpm test` and verify all tests pass
- [ ] 7.3 Test CLI: `splx --version` (after local install or build)
- [ ] 7.4 Test CLI: `splx init` in a temporary directory
- [ ] 7.5 Run `splx validate change --id rename-package-to-opensplx --strict` (using old command if still available, or update validation command)
- [ ] 7.6 Search for any remaining "OpenSplx" references (should be none except historical)
- [ ] 7.7 Search for any remaining "splx" command references (should be none except in comments explaining the rename)
- [ ] 7.8 Verify package.json is valid JSON
- [ ] 7.9 Verify git config remote URL is correct
- [ ] 7.10 Review all documentation for consistency
- [ ] 7.11 Test package installation: `npm pack` to create tarball and verify contents

## Notes

This is a comprehensive verification step. Be thorough in checking:
- All file renames are complete
- All string replacements are correct
- No broken imports or references
- Tests still pass (may need updates for new command name)
- Documentation is consistent

Consider creating a checklist of all files that should have been updated and verify each one.
