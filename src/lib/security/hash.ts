import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/** SHA-256 hex digest. */
export function sha256(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

/** Generate an API key with a visible prefix + random secret. */
export function generateApiKey(): { prefix: string; secret: string; full: string; hash: string } {
  const prefix = `nados_${randomBytes(4).toString('hex')}`;
  const secret = randomBytes(24).toString('base64url');
  const full = `${prefix}_${secret}`;
  return { prefix, secret, full, hash: sha256(full) };
}

/** Constant-time comparison of two hex digests. */
export function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'hex');
  const bb = Buffer.from(b, 'hex');
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

/** Hash IP address for audit logging without storing raw IP. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(0, 16) ?? 'nados';
  return sha256(`${salt}:${ip}`).slice(0, 32);
}
