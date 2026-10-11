import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  const started = Date.now();
  let db = 'down';
  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.from('ai_models').select('id').limit(1);
    if (!error) db = 'up';
  } catch {
    db = 'down';
  }

  return NextResponse.json(
    {
      status: db === 'up' ? 'ok' : 'degraded',
      service: 'nados-ai',
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString(),
      checks: { db, durationMs: Date.now() - started },
    },
    { status: 200 },
  );
}
