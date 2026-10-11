import { describe, it, expect } from 'vitest';
import { truncate, formatNumber, formatCompact, formatBytes } from '@/lib/utils/format';

describe('truncate', () => {
  it('returns short strings unchanged', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });
  it('truncates with ellipsis', () => {
    const out = truncate('hello world', 8);
    expect(out.length).toBeLessThanOrEqual(8);
    expect(out.endsWith('…')).toBe(true);
  });
});

describe('formatBytes', () => {
  it('formats bytes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1024)).toContain('KB');
  });
});
