import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ApiKeyService } from '@/server/services/api-key.service';
import { AuditService } from '@/server/services/audit.service';
import { createApiKeySchema } from '@/lib/validation/api-keys';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });
  const keys = await new ApiKeyService(supabase).list(user.id);
  return NextResponse.json({ success: true, data: keys });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const rl = rateLimit({ key: `apikey:${user.id}`, ...RATE_LIMITS.apiKeysCreate });
  if (!rl.allowed) return NextResponse.json({ success: false, error: { code: 'rate_limited', message: 'حاول لاحقًا' } }, { status: 429 });

  const parsed = createApiKeySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: parsed.error.flatten() } }, { status: 400 });

  const result = await new ApiKeyService(supabase).create(user.id, parsed.data);
  await new AuditService(supabase).log({
    userId: user.id,
    action: 'api_key.create',
    entityType: 'api_key',
    entityId: null,
    metadata: { name: parsed.data.name, scopes: parsed.data.scopes },
  });
  return NextResponse.json({ success: true, data: result }, { status: 201 });
}
