import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getCommandName } from '../../src/utils/command-name.js';

describe('getCommandName', () => {
  let originalArgv: string[];

  beforeEach(() => {
    originalArgv = [...process.argv];
  });

  afterEach(() => {
    process.argv = originalArgv;
  });

  describe('returns splx when invoked via splx', () => {
    it('should return splx for splx.js', () => {
      process.argv = ['node', '/path/to/splx.js'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for splx (no extension)', () => {
      process.argv = ['node', '/path/to/splx'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for PLX (uppercase)', () => {
      process.argv = ['node', '/path/to/PLX'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for Splx (mixed case)', () => {
      process.argv = ['node', '/path/to/Splx.js'];
      expect(getCommandName()).toBe('splx');
    });
  });

  describe('handles Windows extensions', () => {
    it('should return splx for splx.exe', () => {
      process.argv = ['node', 'C:\\Program Files\\splx.exe'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for splx.cmd', () => {
      process.argv = ['node', 'C:\\path\\splx.cmd'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for splx.bat', () => {
      process.argv = ['node', 'C:\\path\\splx.bat'];
      expect(getCommandName()).toBe('splx');
    });

    it('should treat legacy openspec.exe executable as splx (backward compatibility with pre-rebrand name)', () => {
      process.argv = ['node', 'C:\\Program Files\\openspec.exe'];
      expect(getCommandName()).toBe('splx');
    });
  });

  describe('handles Node.js module extensions', () => {
    it('should return splx for splx.cjs', () => {
      process.argv = ['node', '/path/to/splx.cjs'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for splx.mjs', () => {
      process.argv = ['node', '/path/to/splx.mjs'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for splx.ts', () => {
      process.argv = ['node', '/path/to/splx.ts'];
      expect(getCommandName()).toBe('splx');
    });
  });

  describe('defaults to splx', () => {
    it('should treat legacy openspec.js executable as splx (backward compatibility with pre-rebrand name)', () => {
      process.argv = ['node', '/path/to/openspec.js'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx for unknown scripts', () => {
      process.argv = ['node', '/path/to/somescript.js'];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx when argv[1] is empty', () => {
      process.argv = ['node', ''];
      expect(getCommandName()).toBe('splx');
    });

    it('should return splx when argv[1] is undefined', () => {
      process.argv = ['node'];
      expect(getCommandName()).toBe('splx');
    });
  });

  describe('handles various path formats', () => {
    it('should handle Unix paths', () => {
      process.argv = ['node', '/usr/local/bin/splx'];
      expect(getCommandName()).toBe('splx');
    });

    it('should handle Windows paths with backslashes', () => {
      process.argv = ['node', 'C:\\Users\\test\\node_modules\\.bin\\splx.cmd'];
      expect(getCommandName()).toBe('splx');
    });

    it('should handle paths with spaces', () => {
      process.argv = ['node', '/path with spaces/to/splx.js'];
      expect(getCommandName()).toBe('splx');
    });

    it('should handle npx-style paths', () => {
      process.argv = ['node', '/Users/test/.npm/_npx/12345/node_modules/.bin/splx'];
      expect(getCommandName()).toBe('splx');
    });
  });
});
