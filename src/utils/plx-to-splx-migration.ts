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
  tool: string;
}

export interface RenamedFile {
  from: string;
  to: string;
  tool: string;
}

export interface ContentChange {
  line: number;
  before: string;
  after: string;
}

export interface UpdatedFile {
  path: string;
  replacements: number;
  changes?: ContentChange[];
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

export interface ToolMigrationCounts {
  directories: number;
  files: number;
}

export interface MigrationSummary {
  totalDirectories: number;
  totalFiles: number;
  totalContentUpdates: number;
  totalSkipped: number;
  totalErrors: number;
  byTool: Record<string, ToolMigrationCounts>;
}

export interface MigrationResult {
  success: boolean;
  workspaces: WorkspaceMigrationResult[];
  summary: MigrationSummary;
}

/**
 * AI tool directory patterns to migrate
 * Format: { toolDir: { name, subdirs: { subdir: filePattern } } }
 */
const AI_TOOL_PATTERNS: Record<string, { name: string; subdirs: Record<string, string> }> = {
  '.claude': { name: 'Claude Code', subdirs: {} },
  '.cursor': { name: 'Cursor', subdirs: { 'commands': 'plx-*.md' } },
  '.amazonq': { name: 'Amazon Q', subdirs: { 'prompts': 'plx-*.md' } },
  '.augment': { name: 'Augment', subdirs: { 'commands': 'plx-*.md' } },
  '.clinerules': { name: 'Cline', subdirs: { 'workflows': 'plx-*.md' } },
  '.codebuddy': { name: 'CodeBuddy', subdirs: { 'prompts': 'plx-*.md' } },
  '.agent': { name: 'Agent', subdirs: { 'workflows': 'plx-*.md' } },
  '.windsurf': { name: 'Windsurf', subdirs: { 'workflows': 'plx-*.md' } },
  '.qwen': { name: 'Qwen Code', subdirs: { 'commands': 'plx-*.toml' } },
  '.github': { name: 'GitHub Copilot', subdirs: { 'prompts': 'plx-*.prompt.md' } },
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
 * Matches files against a pattern like "plx-*.md" or "plx-*.toml"
 * Returns matched files and their extension for proper renaming
 */
function matchPlxFiles(files: string[], pattern: string): Array<{ file: string; ext: string }> {
  // Pattern format: "plx-*.ext" or "plx-*.suffix.ext"
  // Extract the extension part after "plx-*"
  const extMatch = pattern.match(/^plx-\*(.+)$/);
  if (!extMatch) return [];

  const ext = extMatch[1]; // e.g., ".md", ".toml", ".prompt.md"
  return files
    .filter(f => f.startsWith('plx-') && f.endsWith(ext))
    .map(file => ({ file, ext }));
}

/**
 * Replaces plx references with splx in content, being context-aware
 */
function replacePlxReferences(
  content: string,
  trackChanges = false
): { updated: string; count: number; changes: ContentChange[] } {
  // Patterns that are safe to replace (command references, file paths, etc.)
  // Using string replacements with $1, $2, etc. for capture groups
  const safePatterns: Array<{ pattern: RegExp; replacement: string }> = [
    // `plx command` or `plx-command`
    { pattern: /`plx([\s-])/g, replacement: '`splx$1' },
    // /plx command or /plx-command
    { pattern: /\/plx([\s-])/g, replacement: '/splx$1' },
    // plx command-name (word boundary before, space or dash after)
    { pattern: /\bplx\s+([a-z-]+)/g, replacement: 'splx $1' },
    // .claude/commands/plx/ paths
    { pattern: /\.claude\/commands\/plx\//g, replacement: '.claude/commands/splx/' },
    // plx-*.md file references
    { pattern: /plx-([a-z-]+)\.md/g, replacement: 'splx-$1.md' },
    // `plx` standalone in backticks
    { pattern: /`plx`/g, replacement: '`splx`' },
    // /plx at end of line or followed by non-word
    { pattern: /\/plx\b/g, replacement: '/splx' },
    // | plx in markdown tables
    { pattern: /\|\s*plx\s+/g, replacement: '| splx ' },
    // Frontmatter tags: [plx, ...] or tags: [... plx ...]
    { pattern: /(\btags:\s*\[.*?)\bplx\b(.*?\])/g, replacement: '$1splx$2' },
    // Frontmatter single value: command: plx or type: plx
    { pattern: /^((?:command|type|tool):\s*)plx(\s*)$/gm, replacement: '$1splx$2' },
  ];

  const changes: ContentChange[] = [];

  if (trackChanges) {
    // Process line by line to track changes
    const lines = content.split('\n');
    const updatedLines: string[] = [];
    let totalCount = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const originalLine = line;

      for (const { pattern, replacement } of safePatterns) {
        // Reset regex state for each line
        pattern.lastIndex = 0;
        const matches = line.match(pattern);
        if (matches) {
          totalCount += matches.length;
          line = line.replace(pattern, replacement);
        }
      }

      if (line !== originalLine) {
        changes.push({
          line: i + 1,
          before: originalLine.trim(),
          after: line.trim(),
        });
      }

      updatedLines.push(line);
    }

    return { updated: updatedLines.join('\n'), count: totalCount, changes };
  }

  // Fast path: no change tracking needed
  let updated = content;
  let totalCount = 0;

  for (const { pattern, replacement } of safePatterns) {
    const matches = updated.match(pattern);
    if (matches) {
      totalCount += matches.length;
      updated = updated.replace(pattern, replacement);
    }
  }

  return { updated, count: totalCount, changes };
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
  for (const [toolDir, toolConfig] of Object.entries(AI_TOOL_PATTERNS)) {
    for (const [subdir, pattern] of Object.entries(toolConfig.subdirs)) {
      const fullDir = path.join(projectPath, toolDir, subdir);
      if (await FileSystemUtils.directoryExists(fullDir)) {
        try {
          const files = await fs.readdir(fullDir);
          const plxFiles = matchPlxFiles(files, pattern);
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
 * Migrates PLX artifacts to SPLX in a project directory
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

  const workspaceDir = path.join(workspacePath, PLX_DIR_NAME);

  // 1. Migrate .claude/commands/plx/ directory
  const claudePlxDir = path.join(workspacePath, '.claude', 'commands', 'plx');
  const claudeSplxDir = path.join(workspacePath, '.claude', 'commands', 'splx');
  const claudeToolName = AI_TOOL_PATTERNS['.claude'].name;

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
          tool: claudeToolName,
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
  for (const [toolDir, toolConfig] of Object.entries(AI_TOOL_PATTERNS)) {
    for (const [subdir, pattern] of Object.entries(toolConfig.subdirs)) {
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

      const plxFiles = matchPlxFiles(files, pattern);

      for (const { file: plxFile } of plxFiles) {
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
            tool: toolConfig.name,
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

  // 3. Update content references in instruction files (root and workspace if exists)
  const instructionPaths = [workspacePath];
  if (await FileSystemUtils.directoryExists(workspaceDir)) {
    instructionPaths.push(workspaceDir);
  }

  for (const basePath of instructionPaths) {
    for (const fileName of INSTRUCTION_FILES) {
      const filePath = path.join(basePath, fileName);
      if (!(await FileSystemUtils.fileExists(filePath))) {
        continue;
      }

      try {
        const content = await FileSystemUtils.readFile(filePath);
        const { updated: updatedContent, count: replacements, changes } = replacePlxReferences(
          content,
          options.dryRun
        );

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            await FileSystemUtils.writeFile(filePath, updatedContent);
          }

          result.contentUpdates.push({
            path: getRelativePath(filePath),
            replacements,
            changes: options.dryRun ? changes : undefined,
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

  // 4. Update content in Claude commands directory
  // In dry-run: check original plx/ directory
  // In actual: check renamed splx/ directory (same files, new location)
  const claudeCommandsDir = options.dryRun ? claudePlxDir : claudeSplxDir;

  if (await FileSystemUtils.directoryExists(claudeCommandsDir)) {
    let files: string[] = [];
    try {
      files = await fs.readdir(claudeCommandsDir);
    } catch (error) {
      result.errors.push({
        path: getRelativePath(claudeCommandsDir),
        error: `Cannot read directory: ${(error as Error).message}`,
      });
    }

    for (const file of files.filter(f => f.endsWith('.md'))) {
      const filePath = path.join(claudeCommandsDir, file);

      try {
        const content = await FileSystemUtils.readFile(filePath);
        const { updated: updatedContent, count: replacements, changes } = replacePlxReferences(
          content,
          options.dryRun
        );

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            await FileSystemUtils.writeFile(filePath, updatedContent);
          }

          result.contentUpdates.push({
            path: getRelativePath(filePath),
            replacements,
            changes: options.dryRun ? changes : undefined,
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
        const { updated: updatedContent, count: replacements, changes } = replacePlxReferences(
          content,
          options.dryRun
        );

        if (updatedContent !== content && replacements > 0) {
          if (!options.dryRun) {
            await FileSystemUtils.writeFile(targetPath, updatedContent);
          }

          result.contentUpdates.push({
            path: options.dryRun ? file.from : file.to,
            replacements,
            changes: options.dryRun ? changes : undefined,
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
