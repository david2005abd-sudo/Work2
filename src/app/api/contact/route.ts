import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ContactRepository } from '@/server/repositories/contact.repo';
import { contactSchema } from '@/lib/validation/contact';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anon';
  const rl = rateLimit({ key: `contact:${ip}`, ...RATE_LIMITS.contact });
  if (!rl.allowed) return NextResponse.json({ success: false, error: { code: 'rate_limited', message: 'حاول لاحقًا' } }, { status: 429 });

  const parsed = contactSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: parsed.error.flatten() } }, { status: 400 });

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  const repo = new ContactRepository(supabase);
  await repo.create({ ...parsed.data, user_id: user?.id ?? null });
  return NextResponse.json({ success: true, data: null }, { status: 201 });
}
