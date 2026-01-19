import { promises as fs } from 'fs';
import path from 'path';
import { agentsTemplate } from './agents-template.js';
import { claudeTemplate } from './claude-template.js';
import { clineTemplate } from './cline-template.js';
import { costrictTemplate } from './costrict-template.js';
import { agentsRootStubTemplate } from './agents-root-stub.js';
import { getSlashCommandBody, SlashCommandId } from './slash-command-templates.js';
import { architectureTemplate, ArchitectureContext } from './architecture-template.js';
import { reviewTemplate } from './review-template.js';
import { releaseTemplate } from './release-template.js';
import { testingTemplate } from './testing-template.js';
import { taskTemplate, TaskContext } from './task-template.js';
import { changeTemplate, ChangeContext } from './change-template.js';
import { specTemplate, SpecContext } from './spec-template.js';
import { requestTemplate, RequestContext } from './request-template.js';
import {
  KNOWN_TEMPLATE_TYPES,
  isValidTemplateType,
  type TemplateType,
} from '../../utils/task-utils.js';

export interface Template {
  path: string;
  content: string;
}

export interface WorkspaceTemplateResult {
  body: string;
  found: boolean;
  error?: string;
}

export class TemplateNotFoundError extends Error {
  constructor(templateType: string, templatePath: string) {
    super(`Template '${templateType}' not found at ${templatePath}`);
    this.name = 'TemplateNotFoundError';
  }
}

export class TemplateReadError extends Error {
  constructor(templateType: string, cause: string) {
    super(`Failed to read template '${templateType}': ${cause}`);
    this.name = 'TemplateReadError';
  }
}

export class TemplateManager {
  static getTemplates(): Template[] {
    return [
      {
        path: 'AGENTS.md',
        content: agentsTemplate
      }
    ];
  }

  static getClaudeTemplate(): string {
    return claudeTemplate;
  }

  static getClineTemplate(): string {
    return clineTemplate;
  }

  static getCostrictTemplate(): string {
    return costrictTemplate;
  }

  static getAgentsStandardTemplate(): string {
    return agentsRootStubTemplate;
  }

  static getSlashCommandBody(id: SlashCommandId): string {
    return getSlashCommandBody(id);
  }

  static getArchitectureTemplate(context?: ArchitectureContext): string {
    return architectureTemplate(context);
  }

  static getReviewTemplate(): string {
    return reviewTemplate();
  }

  static getReleaseTemplate(): string {
    return releaseTemplate();
  }

  static getTestingTemplate(): string {
    return testingTemplate();
  }

  static getTaskTemplate(context: TaskContext): string {
    return taskTemplate(context);
  }

  static getChangeTemplate(context: ChangeContext): string {
    return changeTemplate(context);
  }

  static getSpecTemplate(context: SpecContext): string {
    return specTemplate(context);
  }

  static getRequestTemplate(context: RequestContext): string {
    return requestTemplate(context);
  }

  /**
   * Returns the list of known template types.
   */
  static getKnownTemplateTypes(): readonly string[] {
    return KNOWN_TEMPLATE_TYPES;
  }

  /**
   * Validates if a template type is known.
   */
  static isValidTemplateType(type: string): type is TemplateType {
    return isValidTemplateType(type);
  }

  /**
   * Reads a template file from workspace/templates/<type>.md and extracts the body.
   * Strips frontmatter (content between --- markers) and template header.
   * Returns the content starting from the first ## section with the user's title.
   *
   * @param workspacePath - Path to the workspace root
   * @param templateType - The template type (e.g., 'implementation', 'bug')
   * @param taskTitle - The title to use in the task header
   * @returns Object with body content, found status, and optional error message
   */
  static async readWorkspaceTemplate(
    workspacePath: string,
    templateType: string,
    taskTitle: string
  ): Promise<WorkspaceTemplateResult> {
    const templatePath = path.join(workspacePath, 'templates', `${templateType}.md`);

    try {
      const content = await fs.readFile(templatePath, 'utf-8');

      // Strip frontmatter (content between --- markers at the start)
      let body = content;
      if (content.startsWith('---')) {
        const endMarkerIndex = content.indexOf('---', 3);
        if (endMarkerIndex !== -1) {
          body = content.substring(endMarkerIndex + 3).trim();
        }
      }

      // Find the first ## section and keep everything from there
      // This skips the template title (# heading) and any description text
      const firstSectionIndex = body.indexOf('\n## ');
      if (firstSectionIndex !== -1) {
        // Extract the emoji from the original # title line if present
        // Handles basic emoji, ZWJ sequences, and variation selectors
        const titleMatch = body.match(/^#\s*([\p{Emoji_Presentation}\p{Emoji}\uFE0F\u200d]+)\s*/u);
        const emoji = titleMatch ? titleMatch[1] : '📋';

        // Build the task title with emoji and user's title
        const taskTitleLine = `# ${emoji} ${taskTitle}`;
        body = taskTitleLine + '\n' + body.substring(firstSectionIndex + 1);
      }

      return { body, found: true };
    } catch (err) {
      const error = err as NodeJS.ErrnoException;
      if (error.code === 'ENOENT') {
        return { body: '', found: false, error: `Template file not found: ${templatePath}` };
      }
      if (error.code === 'EACCES') {
        return { body: '', found: false, error: `Permission denied reading template: ${templatePath}` };
      }
      return { body: '', found: false, error: `Error reading template: ${error.message}` };
    }
  }
}

export type { SlashCommandId } from './slash-command-templates.js';
export type { ArchitectureContext } from './architecture-template.js';
export type { TaskContext } from './task-template.js';
export type { ChangeContext } from './change-template.js';
export type { SpecContext } from './spec-template.js';
export type { RequestContext } from './request-template.js';
export type { TemplateType } from '../../utils/task-utils.js';
export { KNOWN_TEMPLATE_TYPES, isValidTemplateType } from '../../utils/task-utils.js';
