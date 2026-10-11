import { NextResponse, type NextRequest } from 'next/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { ApiKeyService } from '@/server/services/api-key.service';
import { ChatService } from '@/server/services/chat.service';
import { rateLimit } from '@/lib/security/rate-limit';
import { sendMessageSchema } from '@/lib/validation/chat';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Public developer API: POST /api/v1/chat/completions */
export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const raw = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!raw) {
    return NextResponse.json(
      { success: false, error: { code: 'unauthorized', message: 'مفتاح API مطلوب' } },
      { status: 401 },
    );
  }

  const admin = await createAdminSupabaseClient();
  const keyService = new ApiKeyService(admin);
  const verified = await keyService.verify(raw);
  if (!verified) {
    return NextResponse.json({ success: false, error: { code: 'invalid_key', message: 'مفتاح غير صالح' } }, { status: 401 });
  }
  if (!verified.scopes.includes('chat:write')) {
    return NextResponse.json({ success: false, error: { code: 'forbidden', message: 'لا تملك صلاحية' } }, { status: 403 });
  }

  const rl = rateLimit({ key: `apiv1:${verified.userId}`, limit: 60, windowMs: 60_000 });
  if (!rl.allowed) return NextResponse.json({ success: false, error: { code: 'rate_limited', message: 'تجاوزت الحد' } }, { status: 429 });

  const parsed = sendMessageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: parsed.error.flatten() } }, { status: 400 });
  }

  try {
    const chat = new ChatService(admin);
    const prepared = await chat.prepareChat({
      userId: verified.userId,
      conversationId: parsed.data.conversationId,
      model: parsed.data.model,
      userContent: parsed.data.content,
      systemPrompt: parsed.data.systemPrompt,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown) =>
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        try {
          send('meta', { conversationId: prepared.conversationId });
          for await (const chunk of chat.stream({
            userId: verified.userId,
            conversationId: prepared.conversationId,
            model: prepared.model,
            provider: prepared.provider,
            history: prepared.history,
          })) {
            if (chunk.delta) send('delta', { text: chunk.delta });
            if (chunk.done) { send('done', {}); break; }
          }
          controller.close();
        } catch {
          send('error', { message: 'حدث خطأ' });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
      },
    });
  } catch (err) {
    const e = err as Error & { code?: string; status?: number };
    return NextResponse.json({ success: false, error: { code: e.code ?? 'error', message: e.message } }, { status: e.status ?? 500 });
  }
}
