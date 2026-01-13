import { promises as fs } from 'fs';
import path from 'path';
import { FileSystemUtils } from './file-system.js';
import { PLX_DIR_NAME } from '../core/config.js';

export interface PlxToSplxOptions {
  dryRun?: boolean;
  json?: boolean;
}

export interface RenamedDirectory {
  from: string;
  to: string;
}

export interface RenamedFile {
  from: string;
  to: string;
}

export interface UpdatedFile {
  path: string;
  replacements: number;
}

export interface SkippedItem {
  path: string;
  reason: string;
}

export interface MigrationError {
  path: string;
  error: string;
}

export interface WorkspaceMigrationResult {
  path: string;
  directories: RenamedDirectory[];
  files: RenamedFile[];
  contentUpdates: UpdatedFile[];
  skipped: SkippedItem[];
  errors: MigrationError[];
}

export interface MigrationSummary {
  totalDirectories: number;
  totalFiles: number;
  totalContentUpdates: number;
  totalSkipped: number;
  totalErrors: number;
}

export interface MigrationResult {
  success: boolean;
  workspaces: WorkspaceMigrationResult[];
  summary: MigrationSummary;
}

/**
 * AI tool directory patterns to migrate
 * Format: { toolDir: { subdir: 'file-pattern' } }
 */
const AI_TOOL_PATTERNS: Record<string, Record<string, string>> = {
  '.cursor': { 'commands': 'plx-*.md' },
  '.amazonq': { 'prompts': 'plx-*.md' },
  '.augment': { 'commands': 'plx-*.md' },
  '.clinerules': { 'workflows': 'plx-*.md' },
  '.codebuddy': { 'prompts': 'plx-*.md' },
  '.agent': { 'workflows': 'plx-*.md' },
};

/**
 * Instruction files that may contain plx references
 * Check both root and workspace directories
 */
const INSTRUCTION_FILES = [
  'CLAUDE.md',
  'AGENTS.md',
  'CODEBUDDY.md',
  'CURSOR.md',
  'QODER.md',
];

/**
 * Safely gets relative path, handling edge cases
 */
function getRelativePath(filePath: string): string {
  try {
    return path.relative(process.cwd(), filePath);
  } catch {
    // If relative path fails (e.g., different drives on Windows), return absolute
    return filePath;
  }
}

/**
 * Counts unique replacements in content by applying patterns sequentially
 * and tracking what was actually replaced
 */
function countReplacements(content: string, patterns: RegExp[]): number {
  let count = 0;
  let workingContent = content;

  for (const pattern of patterns) {
    const matches = workingContent.match(pattern);
    if (matches) {
      count += matches.length;
      // Apply replacement to avoid double-counting overlapping patterns
      workingContent = workingContent.replace(pattern, (match) => {
        return match.replace(/plx/g, 'splx');
      });
    }
  }

  return count;
}

/**
 * Replaces plx references with splx in content, being context-aware
 */
function replacePlxReferences(content: string): { updated: string; count: number } {
  // Patterns that are safe to replace (command references, file paths, etc.)
  const safePatterns: Array<{ pattern: RegExp; replacement: (match: string) => string }> = [
    // `plx command` or `plx-command`
    { pattern: /`plx([\s-])/g, replacement: (m) => m.replace('plx', 'splx') },
    // /plx command or /plx-command
    { pattern: /\/plx([\s-])/g, replacement: (m) => m.replace('plx', 'splx') },
    // plx command-name (word boundary before, space or dash after)
    { pattern: /\bplx\s+([a-z-]+)/g, replacement: () => 'splx $1' },
    // .claude/commands/plx/ paths
    { pattern: /\.claude\/commands\/plx\//g, replacement: () => '.claude/commands/splx/' },
    // plx-*.md file references
    { pattern: /plx-([a-z-]+)\.md/g, replacement: () => 'splx-$1.md' },
    // `plx` standalone in backticks
    { pattern: /`plx`/g, replacement: () => '`splx`' },
    // /plx at end of line or followed by non-word
    { pattern: /\/plx\b/g, replacement: () => '/splx' },
  ];

  let updated = content;
  let totalCount = 0;

  for (const { pattern, replacement } of safePatterns) {
    const matches = updated.match(pattern);
    if (matches) {
      totalCount += matches.length;
      updated = updated.replace(pattern, replacement);
    }
  }

  return { updated, count: totalCount };
}

/**
 * Detects PLX artifacts in a project directory
 */
export async function detectPlxArtifacts(projectPath: string): Promise<{
  hasClaudeCommandsDir: boolean;
  hasFilePatterns: boolean;
  hasInstructionFiles: boolean;
}> {
  const claudePlxDir = path.join(projectPath, '.claude', 'commands', 'plx');
  const hasClaudeCommandsDir = await FileSystemUtils.directoryExists(claudePlxDir);

  let hasFilePatterns = false;
  for (const [toolDir, subdirs] of Object.entries(AI_TOOL_PATTERNS)) {
    for (const [subdir] of Object.entries(subdirs)) {
      const fullDir = path.join(projectPath, toolDir, subdir);
      if (await FileSystemUtils.directoryExists(fullDir)) {
        try {
          const files = await fs.readdir(fullDir);
          const plxFiles = files.filter(f => f.startsWith('plx-') && f.endsWith('.md'));
          if (plxFiles.length > 0) {
            hasFilePatterns = true;
            break;
          }
        } catch {
          // Directory might not be readable, continue
        }
      }
    }
    if (hasFilePatterns) break;
  }

  let hasInstructionFiles = false;
  // Check both root and workspace directories
  const checkPaths = [projectPath, path.join(projectPath, PLX_DIR_NAME)];
  
  for (const basePath of checkPaths) {
    for (const fileName of INSTRUCTION_FILES) {
      const filePath = path.join(basePath, fileName);
      if (await FileSystemUtils.fileExists(filePath)) {
        try {
          const content = await FileSystemUtils.readFile(filePath);
          if (content.includes('plx ') || content.includes('`plx') || content.includes('/plx')) {
            hasInstructionFiles = true;
            break;
          }
        } catch {
          // File might not be readable, continue
        }
      }
    }
    if (hasInstructionFiles) break;
  }

  return {
    hasClaudeCommandsDir,
    hasFilePatterns,
    hasInstructionFiles,
  };
}

/**
 * Migrates PLX artifacts to SPLX in a workspace
 */
export async function migratePlxToSplx(
  workspacePath: string,
  options: PlxToSplxOptions = {}
): Promise<WorkspaceMigrationResult> {
  const result: WorkspaceMigrationResult = {
    path: getRelativePath(workspacePath),
    directories: [],
    files: [],
    contentUpdates: [],
    skipped: [],
    errors: [],
  };

  // Validate workspace path
  const workspaceDir = path.join(workspacePath, PLX_DIR_NAME);
  if (!(await FileSystemUtils.directoryExists(workspaceDir))) {
    result.errors.push({
      path: getRelativePath(workspacePath),
      error: 'Not a valid workspace (workspace/ directory not found)',
    });
    return result;
  }

  // 1. Migrate .claude/commands/plx/ directory
  const claudePlxDir = path.join(workspacePath, '.claude', 'commands', 'plx');
  const claudeSplxDir = path.join(workspacePath, '.claude', 'commands', 'splx');

  if (await FileSystemUtils.directoryExists(claudePlxDir)) {
    if (await FileSystemUtils.directoryExists(claudeSplxDir)) {
      result.skipped.push({
        path: getRelativePath(claudePlxDir),
        reason: `Target already exists: ${getRelativePath(claudeSplxDir)}`,
      });
    } else {
      try {
        if (!options.dryRun) {
          await fs.rename(claudePlxDir, claudeSplxDir);
        }
        result.directories.push({
          from: getRelativePath(claudePlxDir),
          to: getRelativePath(claudeSplxDir),
        });
      } catch (error) {
        result.errors.push({
          path: getRelativePath(claudePlxDir),
          error: (error as Error).message,
        });
      }
    }
  }

  // 2. Migrate file patterns in other AI tool directories
  for (const [toolDir, subdirs] of Object.entries(AI_TOOL_PATTERNS)) {
    for (const [subdir] of Object.entries(subdirs)) {
      const fullDir = path.join(workspacePath, toolDir, subdir);
      if (!(await FileSystemUtils.directoryExists(fullDir))) {
        continue;
      }

      let files: string[] = [];
      try {
        files = await fs.readdir(fullDir);
      } catch (error) {
        result.errors.push({
          path: getRelativePath(fullDir),
          error: `Cannot read directory: ${(error as Error).message}`,
        });
        continue;
      }

      const plxFiles = files.filter(f => f.startsWith('plx-') && f.endsWith('.md'));

      for (const plxFile of plxFiles) {
        const fromPath = path.join(fullDir, plxFile);
        const splxFile = plxFile.replace(/^plx-/, 'splx-');
        const toPath = path.join(fullDir, splxFile);
        const fromRelative = getRelativePath(fromPath);

        try {
          if (await FileSystemUtils.fileExists(toPath)) {
            result.skipped.push({
              path: fromRelative,
              reason: `Target already exists: ${getRelativePath(toPath)}`,
            });
            continue;
          }

          if (!options.dryRun) {
            await fs.rename(fromPath, toPath);
          }

          result.files.push({
            from: fromRelative,
            to: getRelativePath(toPath),
          });
        } catch (error) {
          result.errors.push({
            path: fromRelative,
            error: (error as Error).message,
          });
        }
      }
    }
  }

  // 3. Update content references in instruction files (root and workspace)
  const instructionPaths = [
    workspacePath, // Root directory
    workspaceDir, // Workspace directory
  ];

  for (const basePath of instructionPaths) {
    for (const fileName of INSTRUCTION_FILES) {
      const filePath = path.join(basePath, fileName);
      if (!(await FileSystemUtils.fileExists(filePath))) {
        continue;
      }

      try {
        const content = await FileSystemUtils.readFile(filePath);
        const { updated: updatedContent, count: replacements } = replacePlxReferences(content);

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            await FileSystemUtils.writeFile(filePath, updatedContent);
          }

          result.contentUpdates.push({
            path: getRelativePath(filePath),
            replacements,
          });
        }
      } catch (error) {
        result.errors.push({
          path: getRelativePath(filePath),
          error: `Cannot update file: ${(error as Error).message}`,
        });
      }
    }
  }

  // 4. Update content in migrated Claude commands directory
  // After directory rename, update files in the splx directory
  const claudeCommandsDirToCheck = options.dryRun ? claudePlxDir : claudeSplxDir;
  
  if (await FileSystemUtils.directoryExists(claudeCommandsDirToCheck)) {
    let files: string[] = [];
    try {
      files = await fs.readdir(claudeCommandsDirToCheck);
    } catch (error) {
      result.errors.push({
        path: getRelativePath(claudeCommandsDirToCheck),
        error: `Cannot read directory: ${(error as Error).message}`,
      });
    }

    for (const file of files.filter(f => f.endsWith('.md'))) {
      const filePath = path.join(claudeCommandsDirToCheck, file);
      const targetPath = path.join(claudeSplxDir, file);

      try {
        const content = await FileSystemUtils.readFile(filePath);
        const { updated: updatedContent, count: replacements } = replacePlxReferences(content);

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            // Ensure target directory exists (it should after rename, but be safe)
            await FileSystemUtils.createDirectory(path.dirname(targetPath));
            await FileSystemUtils.writeFile(targetPath, updatedContent);
          }

          result.contentUpdates.push({
            path: getRelativePath(filePath),
            replacements,
          });
        }
      } catch (error) {
        result.errors.push({
          path: getRelativePath(filePath),
          error: `Cannot update file: ${(error as Error).message}`,
        });
      }
    }
  }

  // 5. Update content in other migrated files
  // In dry-run mode, check "from" paths; in actual mode, check "to" paths
  for (const file of result.files) {
    const targetPath = options.dryRun
      ? path.join(workspacePath, file.from)
      : path.join(workspacePath, file.to);

    if (await FileSystemUtils.fileExists(targetPath)) {
      try {
        const content = await FileSystemUtils.readFile(targetPath);
        const { updated: updatedContent, count: replacements } = replacePlxReferences(content);

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            await FileSystemUtils.writeFile(targetPath, updatedContent);
          }

          result.contentUpdates.push({
            path: options.dryRun ? file.from : file.to,
            replacements,
          });
        }
      } catch (error) {
        result.errors.push({
          path: options.dryRun ? file.from : file.to,
          error: `Cannot update file: ${(error as Error).message}`,
        });
      }
    }
  }

  return result;
}
