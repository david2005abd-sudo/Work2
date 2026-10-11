import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all paths except:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public assets (svg, png, jpg, jpeg, webp, woff, woff2, ttf)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|otf)$).*)',
  ],
};
