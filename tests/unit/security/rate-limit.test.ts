import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/security/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-01T00:00:00Z'));
  });

  it('allows up to limit then blocks', () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      const r = rateLimit({ key, limit: 5, windowMs: 60_000 });
      expect(r.allowed).toBe(true);
    }
    const blocked = rateLimit({ key, limit: 5, windowMs: 60_000 });
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it('resets after window', () => {
    const key = `test-${Math.random()}`;
    rateLimit({ key, limit: 1, windowMs: 1000 });
    rateLimit({ key, limit: 1, windowMs: 1000 });
    vi.advanceTimersByTime(1500);
    const r = rateLimit({ key, limit: 1, windowMs: 1000 });
    expect(r.allowed).toBe(true);
  });
});
