import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ConversationService } from '@/server/services/conversation.service';
import { createConversationSchema } from '@/lib/validation/chat';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const url = new URL(req.url);
  const service = new ConversationService(supabase);
  const result = await service.list({
    userId: user.id,
    page: Number(url.searchParams.get('page') ?? 1),
    pageSize: Math.min(Number(url.searchParams.get('pageSize') ?? 20), 50),
    onlyArchived: url.searchParams.get('archived') === 'true',
    onlyFavorites: url.searchParams.get('favorite') === 'true',
    search: url.searchParams.get('q') ?? undefined,
  });
  return NextResponse.json({ success: true, data: result });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const parsed = createConversationSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: parsed.error.flatten() } },
      { status: 400 },
    );
  }
  const service = new ConversationService(supabase);
  const created = await service.create(user.id, parsed.data);
  return NextResponse.json({ success: true, data: created }, { status: 201 });
}
