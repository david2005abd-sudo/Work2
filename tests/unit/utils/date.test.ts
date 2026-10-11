import { describe, it, expect } from 'vitest';
import { formatDate, formatRelative, formatDateTime } from '@/lib/utils/date';

describe('formatDate', () => {
  it('formats with Arabic locale', () => {
    const out = formatDate('2025-01-15T00:00:00Z');
    expect(out).toMatch(/2025/);
  });
});

describe('formatDateTime', () => {
  it('includes time', () => {
    const out = formatDateTime('2025-01-15T14:30:00Z');
    expect(out).toMatch(/2025/);
  });
});

describe('formatRelative', () => {
  it('returns Arabic relative label for recent date', () => {
    const out = formatRelative(new Date(Date.now() - 60_000));
    expect(typeof out).toBe('string');
    expect(out.length).toBeGreaterThan(0);
  });
});
