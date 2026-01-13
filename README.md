<p align="center">OpenSpec-driven development for AI coding assistants.</p>
<p align="center">
  <a href="https://github.com/Fission-AI/OpenSpec"><img alt="Fork of OpenSpec" src="https://img.shields.io/badge/Fork%20of-OpenSpec-blue?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/@appboypov/OpenSplx"><img alt="npm version" src="https://img.shields.io/npm/v/@appboypov/OpenSplx?style=flat-square" /></a>
  <a href="https://nodejs.org/"><img alt="node version" src="https://img.shields.io/node/v/@appboypov/OpenSplx?style=flat-square" /></a>
  <a href="./LICENSE"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square" /></a>
</p>

<p align="center">
  <img src="assets/hero.png" alt="OpenSplx dashboard preview" width="90%">
</p>

# OpenSplx

OpenSplx aligns humans and AI coding assistants with spec-driven development. Agree on what to build before any code is written. **No API keys required.**

> Fork of [OpenSpec](https://github.com/Fission-AI/OpenSpec) with extended task management, review workflows, and automatic migration from OpenSpec projects.

## Installation

```bash
npm install -g @appboypov/OpenSplx
splx --version
```

**Prerequisites:** Node.js >= 20.19.0

## Quick Start

```bash
cd my-project
splx init
```

This creates the `workspace/` directory structure and configures slash commands for your AI tools.

## How It Works

```
1. Draft    → Create a change proposal capturing spec updates
2. Review   → Iterate with your AI until everyone agrees
3. Implement → AI works through tasks referencing agreed specs
4. Archive  → Merge approved updates into source-of-truth specs
```

## Commands

### Navigation & Listing

| Command | Description |
|---------|-------------|
| `splx get changes` | List active changes |
| `splx get specs` | List specifications |
| `splx get reviews` | List active reviews |
| `splx view` | Interactive dashboard |

**Note:** `splx list` is deprecated. Use `splx get changes`, `splx get specs`, or `splx get reviews` instead.

### Task Management

| Command | Description |
|---------|-------------|
| `splx get task` | Get next prioritized task |
| `splx get task --id <id>` | Get specific task |
| `splx get task --did-complete-previous` | Complete current, get next |
| `splx get task --constraints` | Show only Constraints |
| `splx get task --acceptance-criteria` | Show only Acceptance Criteria |
| `splx get tasks` | List all open tasks |
| `splx complete task --id <id>` | Mark task done |
| `splx complete change --id <id>` | Complete all tasks in change |
| `splx undo task --id <id>` | Revert task to to-do |
| `splx undo change --id <id>` | Revert all tasks in change |

### Item Retrieval

| Command | Description |
|---------|-------------|
| `splx get change --id <id>` | Get change by ID |
| `splx get spec --id <id>` | Get spec by ID |
| `splx get review --id <id>` | Get review by ID |

**Note:** `splx show` is deprecated. Use `splx get change --id <id>` or `splx get spec --id <id>` instead.

### Review System

| Command | Description |
|---------|-------------|
| `splx review change --id <id>` | Review a change |
| `splx review spec --id <id>` | Review a spec |
| `splx review task --id <id>` | Review a task |
| `splx parse feedback <name> --parent-id <id> --parent-type change|spec|task` | Parse feedback markers |

### Draft Management

| Command | Description |
|---------|-------------|
| `splx paste request` | Paste clipboard content as draft request |

### Validation & Archival

| Command | Description |
|---------|-------------|
| `splx validate change --id <id>` | Validate specific change |
| `splx validate changes` | Validate all changes |
| `splx validate spec --id <id>` | Validate specific spec |
| `splx validate specs` | Validate all specs |
| `splx validate all` | Validate everything |
| `splx archive change --id <id>` | Archive completed change |
| `splx archive review --id <id>` | Archive completed review |

### Configuration

| Command | Description |
|---------|-------------|
| `splx config path` | Show config file location |
| `splx config list` | Show all settings |
| `splx update` | Refresh instruction files |
| `splx upgrade` | Upgrade CLI to latest version |
| `splx upgrade --check` | Check for updates without installing |

### Subdirectory Support

All OpenSplx commands work from any subdirectory within a project. The CLI automatically finds the project root by scanning upward for `workspace/AGENTS.md`.

### Multi-Workspace (Monorepo)

| Command | Description |
|---------|-------------|
| `splx get changes --workspace <name>` | Filter to specific workspace |
| `splx get task --workspace <name>` | Get task from specific workspace |
| `splx validate all --workspace <name>` | Validate specific workspace |

In monorepos, items display with project prefixes (e.g., `project-a/add-feature`). Use `--workspace` to filter operations.

### Transfer (Cross-Workspace)

| Command | Description |
|---------|-------------|
| `splx transfer change --id <id> --target <path>` | Move change and linked tasks |
| `splx transfer spec --id <id> --target <path>` | Move spec and related changes |
| `splx transfer task --id <id> --target <path>` | Move single task |
| `splx transfer review --id <id> --target <path>` | Move review and linked tasks |
| `splx transfer request --id <id> --target <path>` | Move request to target change |

Transfer options: `--source <path>`, `--target-name <name>`, `--dry-run`, `--yes`, `--json`.

## Task Structure

Tasks are stored centrally in `workspace/tasks/` as numbered files:

```
workspace/tasks/
├── 001-add-feature-implement.md          # Parented task (linked to change)
├── 002-add-feature-review.md             # Parented task (linked to change)
├── 003-standalone-task.md                # Standalone task
└── archive/                              # Archived tasks
    └── 001-completed-task.md
```

**Task Filename Patterns:**
- **Parented tasks**: `NNN-<parent-id>-<kebab-case-name>.md` (e.g., `001-add-feature-implement.md`)
- **Standalone tasks**: `NNN-<kebab-case-name>.md` (e.g., `003-standalone-task.md`)

Each task uses YAML frontmatter for status, skill-level, and parent linking:

```yaml
---
status: to-do  # or: in-progress, done
skill-level: medior  # or: junior, senior (optional, guides AI model selection)
parent-type: change  # or: review, spec (optional, for parented tasks)
parent-id: add-feature  # optional, for parented tasks
---
```

**Prioritization:** Changes with highest completion percentage are prioritized first. Within a change, the first `to-do` or `in-progress` task is selected.

**Auto-completion:** When all Implementation Checklist items are checked, the task is automatically marked `done` and the next task begins.

## Review Workflow

Add inline feedback markers during code review:

```typescript
// #FEEDBACK #TODO | Validate input before processing
```

```python
# #FEEDBACK #TODO | Add error handling here
```

```html
<!-- #FEEDBACK #TODO | Missing accessibility attributes -->
```

For parent-linked feedback, include parent type and ID in the marker:

```typescript
// #FEEDBACK #TODO | change:add-feature | Validate input before processing
// #FEEDBACK #TODO | spec:user-auth | Update validation logic
```

Parse markers with: `splx parse feedback review-name --parent-id <id> --parent-type change|spec|task`

## Slash Commands

When you run `splx init`, these commands are installed for supported AI tools:

- `/splx/plan-request` - Clarify intent via iterative yes/no questions
- `/splx/plan-proposal` - Scaffold change proposal (auto-consumes request.md)
- `/splx/plan-implementation` - Generate workspace/PROGRESS.md for multi-agent task handoff
- `/splx/get-task` - Get next prioritized task
- `/splx/copy-next-task` - Copy next task or feedback block to clipboard
- `/splx/copy-review-request` - Copy review request with workspace/REVIEW.md guidelines to clipboard
- `/splx/copy-test-request` - Copy test request with workspace/TESTING.md configuration to clipboard
- `/splx/complete-task` - Mark task as done
- `/splx/undo-task` - Revert task to to-do
- `/splx/implement` - Implement current task with guided workflow
- `/splx/orchestrate` - Coordinate sub-agents for multi-task work
- `/splx/refine-architecture` - Create or update `workspace/ARCHITECTURE.md` with spec-ready component inventories
- `/splx/refine-review` - Create or update `workspace/REVIEW.md` template
- `/splx/refine-release` - Create or update `workspace/RELEASE.md` template
- `/splx/refine-testing` - Create or update `workspace/TESTING.md` template
- `/splx/test` - Run tests based on scope (change, task, or spec)
- `/splx/review` - Review implementations
- `/splx/parse-feedback` - Parse feedback markers
- `/splx/prepare-release` - Guided release preparation workflow
- `/splx/prepare-compact` - Preserve session progress in workspace/PROGRESS.md
- `/splx/sync-workspace` - Sync workspace state across changes

## Supported AI Tools

<details>
<summary><strong>Native Slash Commands</strong></summary>

| Tool | Command Format |
|------|----------------|
| Amazon Q Developer | `splx-plan-proposal`, `splx-implement`, `splx-archive` |
| Antigravity | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Auggie (Augment CLI) | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Claude Code | `/splx:plan-proposal`, `/splx:implement`, `/splx:archive` |
| Cline | Workflows in `.clinerules/workflows/` |
| CodeBuddy Code | `/splx:plan-proposal`, `/splx:implement`, `/splx:archive` |
| Codex | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| CoStrict | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Crush | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Cursor | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Factory Droid | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Gemini CLI | `/splx:plan-proposal`, `/splx:implement`, `/splx:archive` |
| GitHub Copilot | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| iFlow | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Kilo Code | `/splx-plan-proposal.md`, `/splx-implement.md`, `/splx-archive.md` |
| OpenCode | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Qoder | `/splx:plan-proposal`, `/splx:implement`, `/splx:archive` |
| Qwen Code | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| RooCode | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |
| Windsurf | `/splx-plan-proposal`, `/splx-implement`, `/splx-archive` |

</details>

<details>
<summary><strong>AGENTS.md Compatible</strong></summary>

Tools that read workflow instructions from `workspace/AGENTS.md`:

Amp, Jules, and others following the [AGENTS.md convention](https://agents.md/).

</details>

## Contributing

```bash
pnpm install
pnpm run build
pnpm test
```

## License

MIT
