import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, resetPasswordSchema } from '@/lib/validation/auth';

describe('registerSchema', () => {
  const valid = {
    fullName: 'محمد أحمد',
    email: 'User@Example.COM',
    username: 'Mohammed_1',
    password: 'Passw0rd!',
  };

  it('accepts a valid payload and normalizes email + username', () => {
    const result = registerSchema.parse(valid);
    expect(result.email).toBe('user@example.com');
    expect(result.username).toBe('mohammed_1');
  });

  it('rejects short password', () => {
    const r = registerSchema.safeParse({ ...valid, password: 'a1' });
    expect(r.success).toBe(false);
  });

  it('rejects password without digits', () => {
    const r = registerSchema.safeParse({ ...valid, password: 'passwordd' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid username characters', () => {
    const r = registerSchema.safeParse({ ...valid, username: 'Ahmed-1' });
    expect(r.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const r = registerSchema.safeParse({ ...valid, email: 'not-an-email' });
    expect(r.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@b.co', password: 'x' }).success).toBe(true);
  });
});

describe('resetPasswordSchema', () => {
  it('rejects mismatched passwords', () => {
    const r = resetPasswordSchema.safeParse({ password: 'Passw0rd!', confirmPassword: 'Other1!' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.path).toContain('confirmPassword');
    }
  });

  it('accepts matching passwords', () => {
    const r = resetPasswordSchema.safeParse({ password: 'Passw0rd!', confirmPassword: 'Passw0rd!' });
    expect(r.success).toBe(true);
  });
});
