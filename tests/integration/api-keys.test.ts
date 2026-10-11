import { describe, it, expect } from 'vitest';
import { generateApiKey, safeEqual, sha256 } from '@/lib/security/hash';

describe('API key lifecycle primitives', () => {
  it('generates a unique key with verifiable hash', () => {
    const { full, hash } = generateApiKey();
    expect(safeEqual(sha256(full), hash)).toBe(true);
  });

  it('two keys differ', () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.hash).not.toBe(b.hash);
  });
});
