/**
 * In-memory rate limiter. Suitable for Vercel serverless (per-instance).
 * For production-grade distributed limiting, swap with Upstash Redis.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 10_000;

function prune() {
  if (buckets.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of buckets) {
    if (v.resetAt < now) buckets.delete(k);
    if (buckets.size <= MAX_KEYS * 0.8) break;
  }
}

export type RateLimitOptions = {
  key: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    prune();
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  existing.count += 1;
  const allowed = existing.count <= limit;
  return {
    allowed,
    remaining: Math.max(limit - existing.count, 0),
    resetAt: existing.resetAt,
  };
}

export const RATE_LIMITS = {
  login: { limit: 8, windowMs: 60_000 },
  register: { limit: 5, windowMs: 60_000 },
  passwordReset: { limit: 3, windowMs: 300_000 },
  chat: { limit: 30, windowMs: 60_000 },
  contact: { limit: 3, windowMs: 300_000 },
  apiKeysCreate: { limit: 5, windowMs: 60_000 },
} as const;
