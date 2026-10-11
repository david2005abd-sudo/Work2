import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ApiKeyService } from '@/server/services/api-key.service';
import { AuditService } from '@/server/services/audit.service';
import { idParamSchema } from '@/lib/validation/common';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_id', message: 'معرّف غير صالح' } }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  await new ApiKeyService(supabase).revoke(user.id, id);
  await new AuditService(supabase).log({ userId: user.id, action: 'api_key.revoke', entityType: 'api_key', entityId: id });
  return NextResponse.json({ success: true, data: null });
}
