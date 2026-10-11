import { describe, it, expect, beforeEach } from 'vitest';
import { registerSchema, loginSchema } from '@/lib/validation/auth';

/**
 * These tests validate the request shape end-to-end at the schema layer.
 * A live Supabase local instance would replace the mocked auth in
 * tests/db/ for full integration.
 */
describe('Auth integration (schema + boundary)', () => {
  const validSignup = {
    fullName: 'اختبار المستخدم',
    email: 'integration@nados.test',
    username: 'integration_1',
    password: 'SecurePass1',
  };

  it('signup schema accepts valid payload', () => {
    expect(registerSchema.safeParse(validSignup).success).toBe(true);
  });

  it('login schema accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: validSignup.email, password: validSignup.password }).success).toBe(true);
  });

  it('rejects mismatched confirm on reset', async () => {
    const { resetPasswordSchema } = await import('@/lib/validation/auth');
    expect(
      resetPasswordSchema.safeParse({ password: 'Aa123456', confirmPassword: 'Bb123456' }).success,
    ).toBe(false);
  });
});
