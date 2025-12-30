import { PlxTomlSlashCommandConfigurator } from './plx-toml-base.js';
import { PlxSlashCommandId } from '../../templates/index.js';

const FILE_PATHS: Record<PlxSlashCommandId, string> = {
  'get-task': '.gemini/commands/plx/get-task.toml',
  'orchestrate': '.gemini/commands/plx/orchestrate.toml',
  'parse-feedback': '.gemini/commands/plx/parse-feedback.toml',
  'prepare-compact': '.gemini/commands/plx/prepare-compact.toml',
  'prepare-release': '.gemini/commands/plx/prepare-release.toml',
  'refine-architecture': '.gemini/commands/plx/refine-architecture.toml',
  'refine-release': '.gemini/commands/plx/refine-release.toml',
  'refine-review': '.gemini/commands/plx/refine-review.toml',
  'review': '.gemini/commands/plx/review.toml'
};

const DESCRIPTIONS: Record<PlxSlashCommandId, string> = {
  'get-task': 'Select and display the next prioritized task to work on.',
  'orchestrate': 'Orchestrate sub-agents to complete work collaboratively.',
  'parse-feedback': 'Parse feedback markers and generate review tasks.',
  'prepare-compact': 'Preserve session progress in PROGRESS.md for context continuity.',
  'prepare-release': 'Prepare release by updating changelog, readme, and architecture documentation.',
  'refine-architecture': 'Create or update ARCHITECTURE.md.',
  'refine-release': 'Create or update RELEASE.md.',
  'refine-review': 'Create or update REVIEW.md.',
  'review': 'Review implementations against specs, changes, or tasks.'
};

export class PlxGeminiSlashCommandConfigurator extends PlxTomlSlashCommandConfigurator {
  readonly toolId = 'gemini';
  readonly isAvailable = true;

  protected getRelativePath(id: PlxSlashCommandId): string {
    return FILE_PATHS[id];
  }

  protected getDescription(id: PlxSlashCommandId): string {
    return DESCRIPTIONS[id];
  }
}
