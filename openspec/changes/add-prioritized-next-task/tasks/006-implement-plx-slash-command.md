# Task: Implement PLX slash command generation

## End Goal

Add `act-next` to the PLX slash command generation system so it gets created during `openspec init` and `openspec update`.

## Currently

The proposal lists `.claude/commands/plx/act-next.md` as an affected file but the PLX slash command system was not updated.

## Should

Update the PLX slash command template system to generate `act-next` command for all supported tools.

## Constraints

- [ ] Must follow existing PLX slash command patterns
- [ ] Must update all plx-*.ts configurator files

## Acceptance Criteria

- [ ] `act-next` added to `PlxSlashCommandId` type
- [ ] Body content added to `plxSlashCommandBodies`
- [ ] All plx-*.ts configurators updated with FILE_PATHS and FRONTMATTER
- [ ] `openspec update` generates the command file

## Implementation Checklist

- [ ] 6.1 Update `src/core/templates/plx-slash-command-templates.ts`:
  - Add `'act-next'` to `PlxSlashCommandId` type
  - Add body content to `plxSlashCommandBodies`
- [ ] 6.2 Update `src/core/configurators/slash/plx-claude.ts` with FILE_PATHS and FRONTMATTER
- [ ] 6.3 Update `src/core/configurators/slash/plx-cline.ts`
- [ ] 6.4 Update `src/core/configurators/slash/plx-cursor.ts`
- [ ] 6.5 Update `src/core/configurators/slash/plx-windsurf.ts`
- [ ] 6.6 Update `src/core/configurators/slash/plx-codebuddy.ts`
- [ ] 6.7 Update `src/core/configurators/slash/plx-qoder.ts`
- [ ] 6.8 Update `src/core/configurators/slash/plx-kilocode.ts`
- [ ] 6.9 Update `src/core/configurators/slash/plx-opencode.ts`
- [ ] 6.10 Update `src/core/configurators/slash/plx-codex.ts`
- [ ] 6.11 Update `src/core/configurators/slash/plx-github-copilot.ts`
- [ ] 6.12 Update `src/core/configurators/slash/plx-amazon-q.ts`
- [ ] 6.13 Update `src/core/configurators/slash/plx-factory.ts`
- [ ] 6.14 Update `src/core/configurators/slash/plx-gemini.ts`
- [ ] 6.15 Update `src/core/configurators/slash/plx-auggie.ts`
- [ ] 6.16 Update `src/core/configurators/slash/plx-crush.ts`
- [ ] 6.17 Update `src/core/configurators/slash/plx-costrict.ts`
- [ ] 6.18 Update `src/core/configurators/slash/plx-qwen.ts`
- [ ] 6.19 Update `src/core/configurators/slash/plx-roocode.ts`
- [ ] 6.20 Update `src/core/configurators/slash/plx-antigravity.ts`
- [ ] 6.21 Update `src/core/configurators/slash/plx-iflow.ts`
- [ ] 6.22 Run `openspec update` and verify command file is generated
- [ ] 6.23 Add tests for the new command generation

## Notes

Reference existing commands `init-architecture` and `update-architecture` for patterns.
