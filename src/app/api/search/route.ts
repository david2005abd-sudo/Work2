import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MessageService } from '@/server/services/message.service';
import { searchSchema } from '@/lib/validation/chat';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: { code: 'unauthorized', message: 'غير مسجل' } }, { status: 401 });

  const url = new URL(req.url);
  const parsed = searchSchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_input', message: 'استعلام غير صالح' } }, { status: 400 });

  const result = await new MessageService(supabase).search({
    userId: user.id,
    query: parsed.data.q,
    page: parsed.data.page,
    pageSize: parsed.data.pageSize,
    model: parsed.data.model,
    from: parsed.data.from,
    to: parsed.data.to,
  });
  return NextResponse.json({ success: true, data: result });
}
