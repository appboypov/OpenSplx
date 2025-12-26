---
status: to-do
---

# Task: Add get command to shell completion registry

## End Goal

The `get` command with all subcommands and flags is included in shell autocompletion.

## Currently

- `get` command is NOT in `COMMAND_REGISTRY` at `src/core/completions/command-registry.ts`
- Shell completions do not include `get` command or subcommands

## Should

- `COMMAND_REGISTRY` includes `get` command definition
- All subcommands (`task`, `change`, `spec`, `tasks`) have completions
- All flags have completions with descriptions
- Dynamic completion for IDs (change IDs, spec IDs, task IDs)

## Constraints

- [ ] Follow existing `COMMAND_REGISTRY` patterns
- [ ] Use `positionalType` for ID completion

## Acceptance Criteria

- [ ] `plx get <TAB>` shows task, change, spec, tasks
- [ ] `plx get task --<TAB>` shows all task flags
- [ ] `plx get change --id <TAB>` shows available change IDs
- [ ] `plx get spec --id <TAB>` shows available spec IDs
- [ ] Completion scripts regenerate correctly

## Implementation Checklist

- [ ] 3.1 Add `get` command definition to `COMMAND_REGISTRY`
- [ ] 3.2 Add `task` subcommand with all flags
- [ ] 3.3 Add `change` subcommand with flags
- [ ] 3.4 Add `spec` subcommand with flags
- [ ] 3.5 Add `tasks` subcommand with flags
- [ ] 3.6 Test with `plx completion generate zsh`
- [ ] 3.7 Test with `plx completion generate bash`

## Notes

Flag definitions should include `takesValue: true` for `--id` flags.
