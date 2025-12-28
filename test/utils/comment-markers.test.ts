import { describe, it, expect } from 'vitest';
import {
  getCommentStyle,
  formatFeedbackMarker,
  parseFeedbackMarker,
  FEEDBACK_PATTERN,
} from '../../src/utils/comment-markers.js';

describe('comment-markers', () => {
  describe('getCommentStyle', () => {
    describe('single-line // comments', () => {
      const slashExtensions = [
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.c',
        '.cpp',
        '.java',
        '.swift',
        '.go',
        '.rs',
        '.dart',
        '.kt',
        '.scala',
        '.m',
      ];

      for (const ext of slashExtensions) {
        it(`returns // for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '//' });
        });
      }
    });

    describe('hash # comments', () => {
      const hashExtensions = [
        '.py',
        '.rb',
        '.sh',
        '.bash',
        '.zsh',
        '.yaml',
        '.yml',
        '.toml',
        '.pl',
        '.r',
      ];

      for (const ext of hashExtensions) {
        it(`returns # for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '#' });
        });
      }
    });

    describe('double-dash -- comments', () => {
      const dashExtensions = ['.sql', '.lua', '.hs'];

      for (const ext of dashExtensions) {
        it(`returns -- for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: '--' });
        });
      }
    });

    describe('semicolon ; comments', () => {
      const semicolonExtensions = ['.lisp', '.clj', '.el'];

      for (const ext of semicolonExtensions) {
        it(`returns ; for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({ prefix: ';' });
        });
      }
    });

    describe('block comments <!-- -->', () => {
      const xmlExtensions = ['.html', '.xml', '.svg', '.md'];

      for (const ext of xmlExtensions) {
        it(`returns <!-- --> for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({
            prefix: '<!--',
            suffix: '-->',
          });
        });
      }
    });

    describe('block comments /* */', () => {
      const cssExtensions = ['.css', '.scss', '.less'];

      for (const ext of cssExtensions) {
        it(`returns /* */ for ${ext} files`, () => {
          expect(getCommentStyle(`file${ext}`)).toEqual({
            prefix: '/*',
            suffix: '*/',
          });
        });
      }
    });

    it('returns default // for unknown extensions', () => {
      expect(getCommentStyle('file.unknown')).toEqual({ prefix: '//' });
      expect(getCommentStyle('file.xyz')).toEqual({ prefix: '//' });
      expect(getCommentStyle('noextension')).toEqual({ prefix: '//' });
    });

    it('handles case-insensitive extensions', () => {
      expect(getCommentStyle('file.TS')).toEqual({ prefix: '//' });
      expect(getCommentStyle('file.PY')).toEqual({ prefix: '#' });
    });

    it('handles paths with directories', () => {
      expect(getCommentStyle('src/utils/file.ts')).toEqual({ prefix: '//' });
      expect(getCommentStyle('/absolute/path/file.py')).toEqual({ prefix: '#' });
    });
  });

  describe('formatFeedbackMarker', () => {
    it('formats marker for TypeScript files', () => {
      const result = formatFeedbackMarker('file.ts', 'Add validation');
      expect(result).toBe('// #FEEDBACK #TODO | Add validation');
    });

    it('formats marker with spec impact', () => {
      const result = formatFeedbackMarker('file.ts', 'Update spec', 'cli-get-task');
      expect(result).toBe('// #FEEDBACK #TODO | Update spec (spec:cli-get-task)');
    });

    it('formats marker for Python files', () => {
      const result = formatFeedbackMarker('file.py', 'Fix bug');
      expect(result).toBe('# #FEEDBACK #TODO | Fix bug');
    });

    it('formats marker for SQL files', () => {
      const result = formatFeedbackMarker('file.sql', 'Optimize query');
      expect(result).toBe('-- #FEEDBACK #TODO | Optimize query');
    });

    it('formats marker for HTML files with block comment', () => {
      const result = formatFeedbackMarker('file.html', 'Update structure');
      expect(result).toBe('<!-- #FEEDBACK #TODO | Update structure -->');
    });

    it('formats marker for CSS files with block comment', () => {
      const result = formatFeedbackMarker('file.css', 'Fix styling');
      expect(result).toBe('/* #FEEDBACK #TODO | Fix styling */');
    });

    it('formats marker for Markdown files', () => {
      const result = formatFeedbackMarker('docs/readme.md', 'Add section');
      expect(result).toBe('<!-- #FEEDBACK #TODO | Add section -->');
    });

    it('formats marker with spec impact for block comments', () => {
      const result = formatFeedbackMarker('file.html', 'Update docs', 'api-docs');
      expect(result).toBe('<!-- #FEEDBACK #TODO | Update docs (spec:api-docs) -->');
    });
  });

  describe('parseFeedbackMarker', () => {
    it('parses simple feedback marker', () => {
      const result = parseFeedbackMarker('// #FEEDBACK #TODO | Add validation');
      expect(result).toEqual({
        feedback: 'Add validation',
        specImpact: null,
      });
    });

    it('parses feedback marker with spec impact', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | Update requirement (spec:cli-get-task)'
      );
      expect(result).toEqual({
        feedback: 'Update requirement',
        specImpact: 'cli-get-task',
      });
    });

    it('parses Python-style comment', () => {
      const result = parseFeedbackMarker('# #FEEDBACK #TODO | Fix bug');
      expect(result).toEqual({
        feedback: 'Fix bug',
        specImpact: null,
      });
    });

    it('parses SQL-style comment', () => {
      const result = parseFeedbackMarker('-- #FEEDBACK #TODO | Optimize query');
      expect(result).toEqual({
        feedback: 'Optimize query',
        specImpact: null,
      });
    });

    it('parses HTML block comment', () => {
      const result = parseFeedbackMarker('<!-- #FEEDBACK #TODO | Update structure -->');
      expect(result).toEqual({
        feedback: 'Update structure',
        specImpact: null,
      });
    });

    it('parses CSS block comment', () => {
      const result = parseFeedbackMarker('/* #FEEDBACK #TODO | Fix styling */');
      expect(result).toEqual({
        feedback: 'Fix styling',
        specImpact: null,
      });
    });

    it('parses block comment with spec impact', () => {
      const result = parseFeedbackMarker(
        '<!-- #FEEDBACK #TODO | Update docs (spec:api-docs) -->'
      );
      expect(result).toEqual({
        feedback: 'Update docs',
        specImpact: 'api-docs',
      });
    });

    it('handles extra whitespace', () => {
      const result = parseFeedbackMarker('//   #FEEDBACK   #TODO   |   Trim spaces  ');
      expect(result).toEqual({
        feedback: 'Trim spaces',
        specImpact: null,
      });
    });

    it('returns null for invalid lines', () => {
      expect(parseFeedbackMarker('// regular comment')).toBeNull();
      expect(parseFeedbackMarker('// TODO: not a feedback marker')).toBeNull();
      expect(parseFeedbackMarker('console.log("hello")')).toBeNull();
      expect(parseFeedbackMarker('')).toBeNull();
    });

    it('returns null for partial matches', () => {
      expect(parseFeedbackMarker('// #FEEDBACK without TODO')).toBeNull();
      expect(parseFeedbackMarker('// #TODO without FEEDBACK')).toBeNull();
      expect(parseFeedbackMarker('// #FEEDBACK #TODO without pipe')).toBeNull();
    });

    it('handles spec-id with numbers and hyphens', () => {
      const result = parseFeedbackMarker(
        '// #FEEDBACK #TODO | Update (spec:cli-v2-get-task-123)'
      );
      expect(result).toEqual({
        feedback: 'Update',
        specImpact: 'cli-v2-get-task-123',
      });
    });

    it('handles feedback with special characters', () => {
      const result = parseFeedbackMarker(
        "// #FEEDBACK #TODO | Handle edge-case: user's input"
      );
      expect(result).toEqual({
        feedback: "Handle edge-case: user's input",
        specImpact: null,
      });
    });
  });

  describe('FEEDBACK_PATTERN', () => {
    it('matches basic feedback pattern', () => {
      const match = '#FEEDBACK #TODO | Some feedback'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('Some feedback');
      expect(match![2]).toBeUndefined();
    });

    it('matches pattern with spec reference', () => {
      const match = '#FEEDBACK #TODO | Feedback (spec:my-spec)'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('Feedback');
      expect(match![2]).toBe('my-spec');
    });

    it('strips trailing --> from HTML comments', () => {
      const match = '#FEEDBACK #TODO | HTML feedback -->'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('HTML feedback');
    });

    it('strips trailing */ from CSS comments', () => {
      const match = '#FEEDBACK #TODO | CSS feedback */'.match(FEEDBACK_PATTERN);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('CSS feedback');
    });

    it('does not match without pipe separator', () => {
      const match = '#FEEDBACK #TODO No pipe'.match(FEEDBACK_PATTERN);
      expect(match).toBeNull();
    });
  });
});
