import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { execSync } from 'child_process';

describe('spec command deprecation warnings', () => {
  const projectRoot = process.cwd();
  const testDir = path.join(projectRoot, 'test-spec-deprecation-tmp');
  const specsDir = path.join(testDir, 'workspace', 'specs');
  const splxBin = path.join(projectRoot, 'bin', 'splx.js');

  beforeEach(async () => {
    await fs.mkdir(specsDir, { recursive: true });

    const testSpec = `## Purpose
This is a test specification for deprecation warnings.

## Requirements

### Requirement: Feature B
The system SHALL implement feature B

#### Scenario: Feature B works
- **GIVEN** precondition
- **WHEN** action
- **THEN** result
`;

    await fs.mkdir(path.join(specsDir, 'test-spec'), { recursive: true });
    await fs.writeFile(path.join(specsDir, 'test-spec', 'spec.md'), testSpec);
  });

  afterEach(async () => {
    await fs.rm(testDir, { recursive: true, force: true });
  });

  describe('splx spec show', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} spec show test-spec 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx spec show <id>' is deprecated");
        expect(output).toContain("Use 'splx get spec --id <id>' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings spec show test-spec 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('splx spec list', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} spec list 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx spec list' is deprecated");
        expect(output).toContain("Use 'splx get specs' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings spec list 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });

  describe('splx spec validate', () => {
    it('should emit deprecation warning', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} spec validate test-spec 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).toContain("Deprecation: 'splx spec validate <id>' is deprecated");
        expect(output).toContain("Use 'splx validate spec --id <id>' instead");
      } finally {
        process.chdir(originalCwd);
      }
    });

    it('should suppress warning with --no-deprecation-warnings flag', () => {
      const originalCwd = process.cwd();
      try {
        process.chdir(testDir);
        let output = '';
        try {
          output = execSync(`node ${splxBin} --no-deprecation-warnings spec validate test-spec 2>&1`, {
            encoding: 'utf-8'
          });
        } catch (error: any) {
          output = error.stdout?.toString() || '';
          if (error.stderr) {
            output += error.stderr.toString();
          }
        }

        expect(output).not.toContain("Deprecation:");
      } finally {
        process.chdir(originalCwd);
      }
    });
  });
});
