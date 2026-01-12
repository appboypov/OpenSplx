# Change: Rename Package to OpenSplx

## Why

The package was originally named "OpenSplx" as a temporary fork name. We need to rename it back to "OpenSplx" to align with the original project identity and provide a more professional, maintainable brand. This includes renaming the CLI command from `plx` to `splx`, updating the package name, deprecating the current package, and updating all references throughout the codebase.

## What Changes

- **BREAKING**: CLI command renamed from `plx` to `splx`
- **BREAKING**: Package name changed from `@appboypov/pew-pew-plx` to `@appboypov/opensplx`
- **BREAKING**: Repository URL updated from `appboypov/pew-pew-plx` to `appboypov/OpenSplx`
- All occurrences of "OpenSplx", "plx", and "Splx" renamed to "OpenSplx" and "splx" throughout:
  - Source code files
  - Documentation (README.md, ARCHITECTURE.md, AGENTS.md, etc.)
  - Templates and generated content
  - Package.json metadata
- Deprecate current npm package `@appboypov/pew-pew-plx` with migration notice
- Update npm package page for release pipeline using Playwright automation
- Update git repository configuration

## Impact

- Affected specs:
  - `cli-init` - Command name references
  - `cli-*` (all CLI specs) - Command name references
  - `plx-slash-commands` - Slash command names and references
  - `docs-agent-instructions` - Documentation references
  - `plx-conventions` - Naming conventions
- Affected code:
  - `bin/plx.js` → `bin/splx.js`
  - `package.json` - Package name, bin entry, repository URLs
  - All source files with "plx" references
  - All template files
  - All documentation files
  - `.git/config` - Repository URL
- Breaking changes:
  - Existing users must reinstall with new package name
  - All scripts using `plx` command must be updated to `splx`
  - All documentation references to `plx` must be updated
