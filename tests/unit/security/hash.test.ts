import { describe, it, expect } from 'vitest';
import { sha256, generateApiKey, safeEqual, hashIp } from '@/lib/security/hash';

describe('sha256', () => {
  it('produces stable deterministic hash', () => {
    expect(sha256('hello')).toBe(sha256('hello'));
    expect(sha256('hello')).not.toBe(sha256('world'));
  });

  it('produces 64-char hex', () => {
    expect(sha256('x')).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('generateApiKey', () => {
  it('produces prefix + full key with matching hash', () => {
    const { prefix, full, hash } = generateApiKey();
    expect(prefix).toMatch(/^nados_[a-f0-9]{8}$/);
    expect(full.startsWith(`${prefix}_`)).toBe(true);
    expect(hash).toBe(sha256(full));
  });

  it('generates unique keys', () => {
    const a = generateApiKey();
    const b = generateApiKey();
    expect(a.full).not.toBe(b.full);
  });
});

describe('safeEqual', () => {
  it('returns true for equal digests', () => {
    const a = sha256('x');
    expect(safeEqual(a, a)).toBe(true);
  });
  it('returns false for different digests', () => {
    expect(safeEqual(sha256('x'), sha256('y'))).toBe(false);
  });
  it('returns false for mismatched lengths', () => {
    expect(safeEqual('aa', 'aabb')).toBe(false);
  });
});

describe('hashIp', () => {
  it('returns null for empty input', () => {
    expect(hashIp(null)).toBeNull();
    expect(hashIp('')).toBeNull();
  });
  it('produces deterministic hash', () => {
    expect(hashIp('1.2.3.4')).toBe(hashIp('1.2.3.4'));
  });
});
