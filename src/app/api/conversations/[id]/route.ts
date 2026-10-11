import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ConversationService } from '@/server/services/conversation.service';
import { MessageService } from '@/server/services/message.service';
import { updateConversationSchema } from '@/lib/validation/chat';
import { idParamSchema } from '@/lib/validation/common';

export const runtime = 'nodejs';

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_id', message: 'معرّف غير صالح' } }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  try {
    const conversation = await new ConversationService(supabase).getOwnedOrThrow(id, user.id);
    const messages = await new MessageService(supabase).list(user.id, id);
    return NextResponse.json({ success: true, data: { conversation, messages: messages.items } });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ success: false, error: { code: 'not_found', message: e.message } }, { status: e.status ?? 500 });
  }
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_id', message: 'معرّف غير صالح' } }, { status: 400 });

  const body = updateConversationSchema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ success: false, error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: body.error.flatten() } }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  try {
    const updated = await new ConversationService(supabase).update(user.id, id, body.data);
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ success: false, error: { code: 'update_failed', message: e.message } }, { status: e.status ?? 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_id', message: 'معرّف غير صالح' } }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  try {
    await new ConversationService(supabase).delete(user.id, id);
    return NextResponse.json({ success: true, data: null });
  } catch (err) {
    const e = err as Error & { status?: number };
    return NextResponse.json({ success: false, error: { code: 'delete_failed', message: e.message } }, { status: e.status ?? 500 });
  }
}
