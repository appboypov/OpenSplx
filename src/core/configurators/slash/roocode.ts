import { SlashCommandConfigurator } from './base.js';
import { SlashCommandId } from '../../templates/index.js';

const NEW_FILE_PATHS: Record<SlashCommandId, string> = {
  'plan-proposal': '.roo/commands/plx-plan-proposal.md',
  implement: '.roo/commands/plx-implement.md',
  archive: '.roo/commands/plx-archive.md'
};

export class RooCodeSlashCommandConfigurator extends SlashCommandConfigurator {
  readonly toolId = 'roocode';
  readonly isAvailable = true;

  protected getRelativePath(id: SlashCommandId): string {
    return NEW_FILE_PATHS[id];
  }

  protected getFrontmatter(id: SlashCommandId): string | undefined {
    const descriptions: Record<SlashCommandId, string> = {
      'plan-proposal': 'Scaffold a new PLX change and validate strictly.',
      implement: 'Implement an approved PLX change and keep tasks in sync.',
      archive: 'Archive a deployed PLX change and update specs.'
    };
    const titles: Record<SlashCommandId, string> = {
      'plan-proposal': 'Plan Proposal',
      implement: 'Implement',
      archive: 'Archive'
    };
    const description = descriptions[id];
    const title = titles[id];
    return `# PLX: ${title}\n\n${description}`;
  }
}
