# plx-slash-commands Specification

## Purpose
TBD - created by archiving change add-plx-architecture-commands. Update Purpose after archive.
## Requirements
### Requirement: PLX Slash Command Infrastructure

The system SHALL provide a separate PLX slash command infrastructure that coexists with OpenSpec commands without modifying the core OpenSpec workflow.

#### Scenario: PLX command registry exists independently

- **WHEN** the PLX slash command system is initialized
- **THEN** provide a `PlxSlashCommandRegistry` that is separate from `SlashCommandRegistry`
- **AND** support the same tool configurator pattern as OpenSpec commands
- **AND** use the same OpenSpec marker pattern (`<!-- OPENSPEC:START -->` / `<!-- OPENSPEC:END -->`) for managed content

### Requirement: Init Architecture Command

The system SHALL provide a `plx/init-architecture` slash command that instructs AI agents to generate comprehensive architecture documentation.

#### Scenario: Generating init-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/init-architecture.md`
- **AND** include frontmatter with name "PLX: Init Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading project manifest files, exploring the project directory structure, identifying patterns, creating ARCHITECTURE.md at project root

### Requirement: Update Architecture Command

The system SHALL provide a `plx/update-architecture` slash command that instructs AI agents to refresh existing architecture documentation.

#### Scenario: Generating update-architecture command for Claude Code

- **WHEN** Claude Code is selected during initialization
- **THEN** create `.claude/commands/plx/update-architecture.md`
- **AND** include frontmatter with name "PLX: Update Architecture", description, category "PLX", and relevant tags
- **AND** wrap the command body in OpenSpec markers
- **AND** include guardrails focusing on practical, usable documentation
- **AND** include steps for: reading existing ARCHITECTURE.md, exploring codebase for changes, updating document, preserving user-added content

### Requirement: Architecture Template Structure

The system SHALL provide an architecture template that AI agents can use as a starting point for ARCHITECTURE.md generation.

#### Scenario: Template contains required sections

- **WHEN** an AI agent uses the init-architecture command
- **THEN** the generated ARCHITECTURE.md SHALL contain these sections:
  - Overview (project purpose and high-level architecture)
  - Project Setup (prerequisites, installation, development)
  - Technology Stack (core technologies, key dependencies)
  - Project Structure (folder structure documentation)
  - Service Types and Patterns (service architecture, common patterns)
  - State Management (approach, state flow)
  - Conventions (naming, code organization, error handling)
  - API Patterns (external APIs, internal APIs)

### Requirement: PLX Command Updates on Re-Init

The system SHALL update PLX command content within markers when running init in extend mode.

#### Scenario: Refreshing PLX commands on re-init

- **GIVEN** an existing project with PLX commands at "./test-project"
- **WHEN** the user runs `plx init ./test-project` again
- **THEN** update PLX command content within OpenSpec markers
- **AND** preserve any content outside the markers

### Requirement: Act Next Actionable Filtering

The system SHALL filter out non-actionable changes when selecting the next task via `plx act next`.

#### Scenario: Skipping changes with all checkboxes complete

- **WHEN** a change has all implementation checkboxes marked as complete (`- [x]`)
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Skipping changes with no checkboxes

- **WHEN** a change has zero implementation checkboxes in its task files
- **THEN** the `plx act next` command SHALL skip that change
- **AND** select a change with incomplete checkboxes instead

#### Scenario: Returning null when no actionable changes exist

- **WHEN** all active changes are either complete or have no checkboxes
- **THEN** the `plx act next` command SHALL return null
- **AND** display "No active changes found" message

