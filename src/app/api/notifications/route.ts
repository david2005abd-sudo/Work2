import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NotificationService } from '@/server/services/notification.service';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const url = new URL(req.url);
  const service = new NotificationService(supabase);
  const result = await service.list(user.id, {
    page: Number(url.searchParams.get('page') ?? 1),
    pageSize: Number(url.searchParams.get('pageSize') ?? 20),
    unreadOnly: url.searchParams.get('unread') === 'true',
  });
  const unread = await service.unreadCount(user.id);
  return NextResponse.json({ success: true, data: { ...result, unread } });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { ids?: string[]; all?: boolean } | null;
  const service = new NotificationService(supabase);
  if (body?.all) await service.markAllRead(user.id);
  else if (body?.ids?.length) await service.markRead(user.id, body.ids);
  return NextResponse.json({ success: true, data: null });
}
