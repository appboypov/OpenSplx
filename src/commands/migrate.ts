import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { getFilteredWorkspaces } from '../utils/workspace-filter.js';
import { FileSystemUtils } from '../utils/file-system.js';
import { buildTaskFilename, parseTaskFilename } from '../utils/task-file-parser.js';
import { MarkdownParser } from '../core/parsers/markdown-parser.js';
import { TASKS_DIR_NAME } from '../core/config.js';
import {
  migratePlxToSplx,
  detectPlxArtifacts,
  type PlxToSplxOptions,
  type MigrationResult as PlxToSplxMigrationResult,
} from '../utils/plx-to-splx-migration.js';

interface MigrateTasksOptions {
  dryRun?: boolean;
  json?: boolean;
}

interface MigratedTask {
  from: string;
  to: string;
}

interface SkippedTask {
  from: string;
  reason: string;
}

interface TaskError {
  from: string;
  error: string;
}

interface WorkspaceMigrationResult {
  path: string;
  migrated: MigratedTask[];
  skipped: SkippedTask[];
  errors: TaskError[];
}

interface MigrationSummary {
  totalFound: number;
  migrated: number;
  skipped: number;
  errors: number;
}

interface MigrationResult {
  success: boolean;
  workspaces: WorkspaceMigrationResult[];
  summary: MigrationSummary;
}

export class MigrateCommand {
  async tasks(options: MigrateTasksOptions = {}): Promise<void> {
    const workspaces = await getFilteredWorkspaces(process.cwd());

    if (workspaces.length === 0) {
      if (options.json) {
        console.log(JSON.stringify({ error: 'No workspace found' }));
      } else {
        ora().fail('No workspace found. Run splx init first.');
      }
      process.exitCode = 1;
      return;
    }

    const result: MigrationResult = {
      success: true,
      workspaces: [],
      summary: {
        totalFound: 0,
        migrated: 0,
        skipped: 0,
        errors: 0,
      },
    };

    if (!options.json) {
      console.log(chalk.bold('\nMigrating tasks to centralized storage...\n'));
    }

    for (const workspace of workspaces) {
      const workspaceResult = await this.migrateWorkspaceTasks(
        workspace.path,
        workspace.projectName,
        options
      );
      result.workspaces.push(workspaceResult);

      result.summary.totalFound += workspaceResult.migrated.length + workspaceResult.skipped.length + workspaceResult.errors.length;
      result.summary.migrated += workspaceResult.migrated.length;
      result.summary.skipped += workspaceResult.skipped.length;
      result.summary.errors += workspaceResult.errors.length;
    }

    if (result.summary.errors > 0) {
      result.success = false;
    }

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.printConsoleSummary(result);
    }

    if (!result.success) {
      process.exitCode = 1;
    }
  }

  private async migrateWorkspaceTasks(
    workspacePath: string,
    projectName: string,
    options: MigrateTasksOptions
  ): Promise<WorkspaceMigrationResult> {
    const result: WorkspaceMigrationResult = {
      path: path.relative(process.cwd(), workspacePath),
      migrated: [],
      skipped: [],
      errors: [],
    };

    if (!options.json) {
      console.log(chalk.dim(`Workspace: ${result.path}`));
    }

    const changesDir = path.join(workspacePath, 'changes');
    const reviewsDir = path.join(workspacePath, 'reviews');

    if (await FileSystemUtils.directoryExists(changesDir)) {
      await this.migrateParentTypeTasks(
        changesDir,
        'change',
        workspacePath,
        result,
        options
      );
    }

    if (await FileSystemUtils.directoryExists(reviewsDir)) {
      await this.migrateParentTypeTasks(
        reviewsDir,
        'review',
        workspacePath,
        result,
        options
      );
    }

    return result;
  }

  private async migrateParentTypeTasks(
    parentTypeDir: string,
    parentType: 'change' | 'review',
    workspacePath: string,
    result: WorkspaceMigrationResult,
    options: MigrateTasksOptions
  ): Promise<void> {
    let parentDirs: string[] = [];
    try {
      const entries = await fs.readdir(parentTypeDir, { withFileTypes: true });
      parentDirs = entries.filter(e => e.isDirectory()).map(e => e.name);
    } catch {
      return;
    }

    for (const parentDirName of parentDirs) {
      const parentPath = path.join(parentTypeDir, parentDirName);
      const tasksDir = path.join(parentPath, 'tasks');

      if (!(await FileSystemUtils.directoryExists(tasksDir))) {
        continue;
      }

      let taskFiles: string[] = [];
      try {
        const files = await fs.readdir(tasksDir);
        taskFiles = files.filter(f => f.endsWith('.md') && /^\d{3}-/.test(f));
      } catch {
        continue;
      }

      for (const taskFile of taskFiles) {
        const taskPath = path.join(tasksDir, taskFile);
        await this.migrateTaskFile(
          taskPath,
          taskFile,
          parentDirName,
          parentType,
          workspacePath,
          result,
          options
        );
      }

      if (!options.dryRun && taskFiles.length > 0) {
        await this.cleanupEmptyDirectory(tasksDir);
      }
    }
  }

  private async migrateTaskFile(
    taskPath: string,
    taskFile: string,
    parentId: string,
    parentType: 'change' | 'review',
    workspacePath: string,
    result: WorkspaceMigrationResult,
    options: MigrateTasksOptions
  ): Promise<void> {
    const fromRelative = path.relative(process.cwd(), taskPath);

    try {
      const content = await FileSystemUtils.readFile(taskPath);
      const parsed = parseTaskFilename(taskFile);

      if (!parsed) {
        result.skipped.push({
          from: fromRelative,
          reason: 'Invalid task filename format',
        });
        return;
      }

      const { sequence, name } = parsed;
      const newFilename = buildTaskFilename({ sequence, parentId, name });
      const centralTasksDir = path.join(workspacePath, TASKS_DIR_NAME);
      const newTaskPath = path.join(centralTasksDir, newFilename);
      const toRelative = path.relative(process.cwd(), newTaskPath);

      if (await FileSystemUtils.fileExists(newTaskPath)) {
        result.skipped.push({
          from: fromRelative,
          reason: `Target already exists: ${toRelative}`,
        });
        return;
      }

      const updatedContent = MarkdownParser.updateFrontmatter(content, {
        parentType,
        parentId,
      });

      if (!options.dryRun) {
        await FileSystemUtils.createDirectory(centralTasksDir);
        await FileSystemUtils.writeFile(newTaskPath, updatedContent);
        await fs.unlink(taskPath);
      }

      result.migrated.push({
        from: fromRelative,
        to: toRelative,
      });

      if (!options.json) {
        console.log(chalk.green(`  ✓ ${newFilename}`) + chalk.dim(` (from ${fromRelative})`));
      }
    } catch (error) {
      result.errors.push({
        from: fromRelative,
        error: (error as Error).message,
      });

      if (!options.json) {
        console.log(chalk.red(`  ✗ ${taskFile}`) + chalk.dim(` (error: ${(error as Error).message})`));
      }
    }
  }

  private async cleanupEmptyDirectory(dirPath: string): Promise<void> {
    try {
      const entries = await fs.readdir(dirPath);
      if (entries.length === 0) {
        await fs.rmdir(dirPath);
      }
    } catch {
      // Directory might not be empty or already deleted
    }
  }

  async plxToSplx(options: PlxToSplxOptions = {}): Promise<void> {
    const workspaces = await getFilteredWorkspaces(process.cwd());

    // If no workspaces found, check for plx artifacts at root level
    const projectPaths = workspaces.length > 0
      ? workspaces.map(w => w.path)
      : [process.cwd()];

    const result: PlxToSplxMigrationResult = {
      success: true,
      workspaces: [],
      summary: {
        totalDirectories: 0,
        totalFiles: 0,
        totalContentUpdates: 0,
        totalSkipped: 0,
        totalErrors: 0,
        byTool: {},
      },
    };

    if (!options.json) {
      console.log(chalk.bold('\nMigrating PLX to SPLX...\n'));
    }

    let hasAnyArtifacts = false;

    for (const projectPath of projectPaths) {
      const detection = await detectPlxArtifacts(projectPath);

      if (!detection.hasClaudeCommandsDir && !detection.hasFilePatterns && !detection.hasInstructionFiles) {
        if (!options.json) {
          console.log(chalk.dim(`Project: ${path.relative(process.cwd(), projectPath) || '.'}`));
          console.log(chalk.dim('  No PLX artifacts found'));
        }
        continue;
      }

      hasAnyArtifacts = true;
      const workspaceResult = await migratePlxToSplx(projectPath, options);
      result.workspaces.push(workspaceResult);

      result.summary.totalDirectories += workspaceResult.directories.length;
      result.summary.totalFiles += workspaceResult.files.length;
      result.summary.totalContentUpdates += workspaceResult.contentUpdates.length;
      result.summary.totalSkipped += workspaceResult.skipped.length;
      result.summary.totalErrors += workspaceResult.errors.length;

      // Aggregate per-tool counts
      for (const dir of workspaceResult.directories) {
        if (!result.summary.byTool[dir.tool]) {
          result.summary.byTool[dir.tool] = { directories: 0, files: 0 };
        }
        result.summary.byTool[dir.tool].directories++;
      }
      for (const file of workspaceResult.files) {
        if (!result.summary.byTool[file.tool]) {
          result.summary.byTool[file.tool] = { directories: 0, files: 0 };
        }
        result.summary.byTool[file.tool].files++;
      }

      if (!options.json) {
        console.log(chalk.dim(`Workspace: ${workspaceResult.path}`));

        for (const dir of workspaceResult.directories) {
          const prefix = options.dryRun ? 'Would rename' : 'Renamed';
          console.log(chalk.green(`  ✓ [${dir.tool}] ${prefix} directory: ${dir.from} → ${dir.to}`));
        }

        for (const file of workspaceResult.files) {
          const prefix = options.dryRun ? 'Would rename' : 'Renamed';
          console.log(chalk.green(`  ✓ [${file.tool}] ${prefix} file: ${file.from} → ${file.to}`));
        }

        for (const update of workspaceResult.contentUpdates) {
          const prefix = options.dryRun ? 'Would update' : 'Updated';
          console.log(chalk.blue(`  ✓ ${prefix}: ${update.path} (${update.replacements} replacement${update.replacements !== 1 ? 's' : ''})`));
          if (options.dryRun && update.changes && update.changes.length > 0) {
            for (const change of update.changes) {
              console.log(chalk.dim(`      Line ${change.line}:`));
              console.log(chalk.red(`        - ${change.before}`));
              console.log(chalk.green(`        + ${change.after}`));
            }
          }
        }

        for (const skipped of workspaceResult.skipped) {
          console.log(chalk.yellow(`  ⊘ Skipped: ${skipped.path}`) + chalk.dim(` (${skipped.reason})`));
        }

        for (const error of workspaceResult.errors) {
          console.log(chalk.red(`  ✗ Error: ${error.path}`) + chalk.dim(` (${error.error})`));
        }
      }
    }

    if (!hasAnyArtifacts) {
      if (options.json) {
        // Return consistent structure with empty results
        console.log(JSON.stringify({
          success: true,
          workspaces: [],
          summary: {
            totalDirectories: 0,
            totalFiles: 0,
            totalContentUpdates: 0,
            totalSkipped: 0,
            totalErrors: 0,
            byTool: {},
          },
          message: 'No PLX artifacts found to migrate',
        }, null, 2));
      } else {
        console.log(chalk.dim('\nNo PLX artifacts found to migrate.\n'));
      }
      return;
    }

    if (result.summary.totalErrors > 0) {
      result.success = false;
    }

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.printPlxToSplxSummary(result);
    }

    if (!result.success) {
      process.exitCode = 1;
    }
  }

  private printPlxToSplxSummary(result: PlxToSplxMigrationResult): void {
    console.log();
    console.log(chalk.bold('Migration complete:'));
    console.log(chalk.green(`  Directories renamed: ${result.summary.totalDirectories}`));
    console.log(chalk.green(`  Files renamed: ${result.summary.totalFiles}`));
    console.log(chalk.blue(`  Files updated: ${result.summary.totalContentUpdates}`));

    if (result.summary.totalSkipped > 0) {
      console.log(chalk.yellow(`  Skipped: ${result.summary.totalSkipped}`));
    } else {
      console.log(chalk.dim(`  Skipped: ${result.summary.totalSkipped}`));
    }

    if (result.summary.totalErrors > 0) {
      console.log(chalk.red(`  Errors: ${result.summary.totalErrors}`));
    } else {
      console.log(chalk.dim(`  Errors: ${result.summary.totalErrors}`));
    }

    // Show per-tool breakdown if there are any results
    const tools = Object.keys(result.summary.byTool);
    if (tools.length > 0) {
      console.log();
      console.log(chalk.bold('By tool:'));
      for (const tool of tools) {
        const counts = result.summary.byTool[tool];
        const parts: string[] = [];
        if (counts.directories > 0) {
          parts.push(`${counts.directories} dir${counts.directories !== 1 ? 's' : ''}`);
        }
        if (counts.files > 0) {
          parts.push(`${counts.files} file${counts.files !== 1 ? 's' : ''}`);
        }
        console.log(chalk.dim(`  ${tool}: ${parts.join(', ')}`));
      }
    }

    console.log();
  }

  private printConsoleSummary(result: MigrationResult): void {
    console.log();
    console.log(chalk.bold('Migration complete:'));
    console.log(`  Total found: ${result.summary.totalFound}`);
    console.log(chalk.green(`  Migrated: ${result.summary.migrated}`));

    if (result.summary.skipped > 0) {
      console.log(chalk.yellow(`  Skipped: ${result.summary.skipped}`));
    } else {
      console.log(chalk.dim(`  Skipped: ${result.summary.skipped}`));
    }

    if (result.summary.errors > 0) {
      console.log(chalk.red(`  Errors: ${result.summary.errors}`));
    } else {
      console.log(chalk.dim(`  Errors: ${result.summary.errors}`));
    }

    console.log();
  }
}
