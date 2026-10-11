import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ChatService } from '@/server/services/chat.service';
import { AuditService } from '@/server/services/audit.service';
import { sendMessageSchema } from '@/lib/validation/chat';
import { rateLimit, RATE_LIMITS } from '@/lib/security/rate-limit';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { success: false, error: { code: 'unauthorized', message: 'يجب تسجيل الدخول' } },
      { status: 401 },
    );
  }

  const rl = rateLimit({ key: `chat:${user.id}`, ...RATE_LIMITS.chat });
  if (!rl.allowed) {
    return NextResponse.json(
      { success: false, error: { code: 'rate_limited', message: 'عدد الطلبات كبير جدًا' } },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetAt - Date.now()) / 1000)) } },
    );
  }

  const raw = await req.json().catch(() => null);
  const parsed = sendMessageSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { code: 'invalid_input', message: 'بيانات غير صالحة', details: parsed.error.flatten() },
      },
      { status: 400 },
    );
  }

  const audit = new AuditService(supabase);
  const chat = new ChatService(supabase);
  const abort = new AbortController();
  req.signal.addEventListener('abort', () => abort.abort());

  try {
    const prepared = await chat.prepareChat({
      userId: user.id,
      conversationId: parsed.data.conversationId,
      model: parsed.data.model,
      userContent: parsed.data.content,
      systemPrompt: parsed.data.systemPrompt,
      clientMessageId: parsed.data.clientMessageId,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
        };

        try {
          send('meta', {
            conversationId: prepared.conversationId,
            userMessageId: prepared.userMessage.id,
            model: prepared.model,
          });

          for await (const chunk of chat.stream({
            userId: user.id,
            conversationId: prepared.conversationId,
            model: prepared.model,
            provider: prepared.provider,
            history: prepared.history,
            signal: abort.signal,
          })) {
            if (chunk.delta) send('delta', { text: chunk.delta });
            if (chunk.done) {
              send('done', { conversationId: prepared.conversationId });
              break;
            }
          }
          controller.close();

          void audit.log({
            userId: user.id,
            action: 'chat.send',
            entityType: 'conversation',
            entityId: prepared.conversationId,
            ip: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
            userAgent: req.headers.get('user-agent'),
            metadata: { model: prepared.model },
          });
        } catch (err) {
          logger.error('chat stream error', { err: String(err) });
          send('error', { message: 'حدث خطأ أثناء توليد الرد' });
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (err) {
    const e = err as Error & { code?: string; status?: number };
    logger.warn('chat request failed', { code: e.code, message: e.message });
    return NextResponse.json(
      { success: false, error: { code: e.code ?? 'chat_error', message: e.message } },
      { status: e.status ?? 500 },
    );
  }
}
