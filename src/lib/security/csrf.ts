import type { NextRequest } from 'next/server';

const ALLOWED_ORIGINS = new Set<string>([
  process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
]);

/** Check Origin/Referer on state-changing requests. */
export function verifyOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return true; // allow same-site non-browser
  return ALLOWED_ORIGINS.has(origin) ||
    origin.startsWith('http://localhost:') ||
    origin.endsWith('.vercel.app');
}
