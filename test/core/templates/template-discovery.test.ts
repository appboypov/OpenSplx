import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import {
  discoverTemplates,
  getBuiltInTemplates,
  getAvailableTypes,
  getTemplateByType,
} from '../../../src/core/templates/template-discovery.js';

describe('Template Discovery', () => {
  let tempDir: string;

  beforeEach(async () => {
    // Create a temporary directory for testing
    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'template-test-'));
  });

  afterEach(async () => {
    // Clean up temporary directory
    await fs.rm(tempDir, { recursive: true, force: true });
  });

  describe('getBuiltInTemplates', () => {
    it('should return all 12 built-in templates', () => {
      const templates = getBuiltInTemplates();
      expect(templates).toHaveLength(12);

      const types = templates.map((t) => t.type);
      expect(types).toContain('story');
      expect(types).toContain('bug');
      expect(types).toContain('business-logic');
      expect(types).toContain('components');
      expect(types).toContain('research');
      expect(types).toContain('discovery');
      expect(types).toContain('chore');
      expect(types).toContain('refactor');
      expect(types).toContain('infrastructure');
      expect(types).toContain('documentation');
      expect(types).toContain('release');
      expect(types).toContain('implementation');
    });

    it('should return templates with correct structure', () => {
      const templates = getBuiltInTemplates();
      for (const template of templates) {
        expect(template).toHaveProperty('type');
        expect(template).toHaveProperty('content');
        expect(template).toHaveProperty('source');
        expect(template.source).toBe('built-in');
        expect(template.content).toContain('---');
        expect(template.content).toContain(`type: ${template.type}`);
      }
    });
  });

  describe('discoverTemplates', () => {
    it('should return empty array when templates directory does not exist', async () => {
      const templates = await discoverTemplates(tempDir);
      expect(templates).toEqual([]);
    });

    it('should discover user templates from workspace/templates/', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const customTemplate = `---
type: custom
---

# Custom Template

This is a custom template for testing.
`;

      await fs.writeFile(path.join(templatesDir, 'custom.md'), customTemplate);

      const templates = await discoverTemplates(tempDir);
      expect(templates).toHaveLength(1);
      expect(templates[0].type).toBe('custom');
      expect(templates[0].content).toBe(customTemplate);
      expect(templates[0].source).toBe('user');
      expect(templates[0].filePath).toBe(path.join(templatesDir, 'custom.md'));
    });

    it('should skip files without type in frontmatter', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const invalidTemplate = `---
title: Invalid
---

# Invalid Template
`;

      await fs.writeFile(path.join(templatesDir, 'invalid.md'), invalidTemplate);

      const templates = await discoverTemplates(tempDir);
      expect(templates).toEqual([]);
    });

    it('should skip files without frontmatter', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const noFrontmatter = `# Template Without Frontmatter

This template has no frontmatter.
`;

      await fs.writeFile(path.join(templatesDir, 'no-frontmatter.md'), noFrontmatter);

      const templates = await discoverTemplates(tempDir);
      expect(templates).toEqual([]);
    });

    it('should skip non-markdown files', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      await fs.writeFile(path.join(templatesDir, 'README.txt'), 'Not a markdown file');

      const templates = await discoverTemplates(tempDir);
      expect(templates).toEqual([]);
    });

    it('should discover multiple templates', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const template1 = `---
type: custom1
---

# Custom Template 1
`;

      const template2 = `---
type: custom2
---

# Custom Template 2
`;

      await fs.writeFile(path.join(templatesDir, 'custom1.md'), template1);
      await fs.writeFile(path.join(templatesDir, 'custom2.md'), template2);

      const templates = await discoverTemplates(tempDir);
      expect(templates).toHaveLength(2);

      const types = templates.map((t) => t.type);
      expect(types).toContain('custom1');
      expect(types).toContain('custom2');
    });
  });

  describe('getAvailableTypes', () => {
    it('should return all built-in templates when no user templates exist', async () => {
      const templates = await getAvailableTypes(tempDir);
      expect(templates).toHaveLength(12);
    });

    it('should include user templates alongside built-in templates', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const customTemplate = `---
type: custom
---

# Custom Template
`;

      await fs.writeFile(path.join(templatesDir, 'custom.md'), customTemplate);

      const templates = await getAvailableTypes(tempDir);
      expect(templates).toHaveLength(13); // 12 built-in + 1 custom

      const types = templates.map((t) => t.type);
      expect(types).toContain('custom');
      expect(types).toContain('story');
    });

    it('should allow user templates to override built-in templates', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const overrideTemplate = `---
type: story
---

# Custom Story Template

This overrides the built-in story template.
`;

      await fs.writeFile(path.join(templatesDir, 'story.md'), overrideTemplate);

      const templates = await getAvailableTypes(tempDir);
      expect(templates).toHaveLength(12); // Still 12 templates

      const storyTemplate = templates.find((t) => t.type === 'story');
      expect(storyTemplate).toBeDefined();
      expect(storyTemplate!.source).toBe('user');
      expect(storyTemplate!.content).toContain('This overrides the built-in story template.');
    });
  });

  describe('getTemplateByType', () => {
    it('should return built-in template when no user template exists', async () => {
      const content = await getTemplateByType('story', tempDir);
      expect(content).not.toBeNull();
      expect(content).toContain('# ✨ Story Template');
      expect(content).toContain('type: story');
    });

    it('should return user template when it exists', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const customTemplate = `---
type: custom
---

# Custom Template Content
`;

      await fs.writeFile(path.join(templatesDir, 'custom.md'), customTemplate);

      const content = await getTemplateByType('custom', tempDir);
      expect(content).toBe(customTemplate);
    });

    it('should prioritize user template over built-in template', async () => {
      const templatesDir = path.join(tempDir, 'templates');
      await fs.mkdir(templatesDir, { recursive: true });

      const overrideTemplate = `---
type: bug
---

# Custom Bug Template

This is a user-defined bug template.
`;

      await fs.writeFile(path.join(templatesDir, 'bug.md'), overrideTemplate);

      const content = await getTemplateByType('bug', tempDir);
      expect(content).toBe(overrideTemplate);
      expect(content).toContain('This is a user-defined bug template.');
    });

    it('should return null for non-existent template type', async () => {
      const content = await getTemplateByType('non-existent', tempDir);
      expect(content).toBeNull();
    });

    it('should return correct content for all built-in types', async () => {
      const builtInTypes = [
        'story',
        'bug',
        'business-logic',
        'components',
        'research',
        'discovery',
        'chore',
        'refactor',
        'infrastructure',
        'documentation',
        'release',
        'implementation',
      ];

      for (const type of builtInTypes) {
        const content = await getTemplateByType(type, tempDir);
        expect(content).not.toBeNull();
        expect(content).toContain(`type: ${type}`);
      }
    });
  });
});
