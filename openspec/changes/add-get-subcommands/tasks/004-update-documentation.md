---
status: to-do
---

# Task: Update AGENTS.md template with get commands documentation

## End Goal

The AGENTS.md template includes documentation for all new get commands so AI agents can discover and use them.

## Currently

- AGENTS.md template in `src/core/templates/agents-template.ts` does not document get subcommands
- AI agents cannot discover the new commands

## Should

- CLI Commands section includes all get subcommands
- Filter flags are documented with examples
- Documentation follows existing style

## Constraints

- [ ] Integrate into existing CLI Commands section (not new section)
- [ ] Ensure template escaping is correct for backticks
- [ ] Documentation must be concise

## Acceptance Criteria

- [ ] `openspec get task`, `get change`, `get spec`, `get tasks` documented
- [ ] Filter flags (`--constraints`, `--acceptance-criteria`) explained
- [ ] Usage examples included
- [ ] `plx init` creates AGENTS.md with new commands
- [ ] `plx update` updates existing projects

## Implementation Checklist

- [ ] 4.1 Add get task command with --id and filter flags to CLI Commands section
- [ ] 4.2 Add get change command documentation
- [ ] 4.3 Add get spec command documentation
- [ ] 4.4 Add get tasks command documentation
- [ ] 4.5 Add usage examples for common workflows
- [ ] 4.6 Test with fresh `plx init` project
- [ ] 4.7 Test with `plx update` on existing project

## Notes

Add after the existing `openspec list` documentation in CLI Commands section.
