import { describe, it, expect } from 'vitest';
import { isAdmin, isOwner, hasRole } from '@/lib/security/permissions';

describe('permissions', () => {
  it('hasRole respects hierarchy', () => {
    expect(hasRole('owner', 'admin')).toBe(true);
    expect(hasRole('admin', 'admin')).toBe(true);
    expect(hasRole('admin', 'owner')).toBe(false);
    expect(hasRole('user', 'admin')).toBe(false);
    expect(hasRole(null, 'user')).toBe(false);
  });

  it('isAdmin', () => {
    expect(isAdmin('admin')).toBe(true);
    expect(isAdmin('owner')).toBe(true);
    expect(isAdmin('user')).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });

  it('isOwner', () => {
    expect(isOwner('owner')).toBe(true);
    expect(isOwner('admin')).toBe(false);
  });
});
