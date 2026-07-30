import { beforeEach, describe, expect, it } from 'bun:test';
import { createTemplate } from './template.utils';

describe('Template Utils', () => {
  describe('createTemplate', () => {
    it('should remove a single mustache expression', () => {
      const result = createTemplate('<div>{{title}}</div>');
      expect(result).toBe('<div></div>');
    });

    it('should remove multiple mustache expressions', () => {
      const result = createTemplate('<div>{{title}} {{description}}</div>');
      expect(result).toBe('<div></div>');
    });

    it('should leave text without mustache expressions unchanged', () => {
      const result = createTemplate('<div>Hello World</div>');
      expect(result).toBe('<div>Hello World</div>');
    });

    it('should remove nested-looking mustache expressions', () => {
      const result = createTemplate('{{foo{{bar}}}}');
      expect(result).toBe('');
    });
  });
});
