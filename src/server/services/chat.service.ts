import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getProviderForModel } from '@/lib/ai/factory';
import { ProviderError } from '@/lib/ai/provider';
import type { AIMessage } from '@/types/ai';
import { ConversationService } from './conversation.service';
import { MessageService } from './message.service';
import { UsageService } from './usage.service';
import { AiModelsRepository } from '@/server/repositories/ai-models.repo';

const DEFAULT_SYSTEM_PROMPT =
  'أنت مساعد ذكي عربي تُدعى Nados. أجب بدقة ووضوح وباللغة العربية الفصحى المبسطة ما لم يُطلب غير ذلك. كن موجزًا ومفيدًا.';

export class ChatService {
  private readonly conversations: ConversationService;
  private readonly messages: MessageService;
  private readonly usage: UsageService;
  private readonly models: AiModelsRepository;

  constructor(private readonly db: SupabaseClient<Database>) {
    this.conversations = new ConversationService(db);
    this.messages = new MessageService(db);
    this.usage = new UsageService(db);
    this.models = new AiModelsRepository(db);
  }

  async prepareChat(params: {
    userId: string;
    conversationId?: string;
    model: string;
    userContent: string;
    systemPrompt?: string;
    clientMessageId?: string;
  }) {
    const model = await this.models.findBySlug(params.model);
    if (!model || !model.is_enabled) {
      throw this.error('النموذج غير متاح', 'model_not_available', 400);
    }

    const quota = await this.usage.checkQuota(params.userId);
    if (!quota.allowed) {
      throw this.error('تجاوزت الحد اليومي المجاني', 'quota_exceeded', 429);
    }

    // Get or create conversation
    let conversationId = params.conversationId;
    if (conversationId) {
      await this.conversations.getOwnedOrThrow(conversationId, params.userId);
    } else {
      const created = await this.conversations.create(params.userId, {
        model: params.model,
        systemPrompt: params.systemPrompt,
      });
      conversationId = created.id;
    }

    // Save user message
    const userMessage = await this.messages.append({
      userId: params.userId,
      conversationId,
      role: 'user',
      content: params.userContent,
      clientMessageId: params.clientMessageId,
    });

    // Auto-title on first message
    const { total } = await this.messages.list(params.userId, conversationId);
    if (total === 1) {
      await this.conversations.autoTitle(conversationId, params.userContent);
    }

    // Build message history
    const { items } = await this.messages.list(params.userId, conversationId);
    const conversation = await this.conversations.getOwnedOrThrow(conversationId, params.userId);
    const systemPrompt = conversation.system_prompt ?? params.systemPrompt ?? DEFAULT_SYSTEM_PROMPT;

    const history: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      ...items
        .filter((m) => m.role !== 'system' && m.status === 'complete')
        .map((m) => ({ role: m.role as AIMessage['role'], content: m.content })),
    ];

    return {
      conversationId,
      userMessage,
      model: params.model,
      provider: model.provider,
      history,
    };
  }

  async *stream(params: {
    userId: string;
    conversationId: string;
    model: string;
    provider: string;
    history: AIMessage[];
    signal?: AbortSignal;
  }): AsyncIterable<{ delta: string; done: boolean; full: string }> {
    const provider = getProviderForModel(params.model);
    const startedAt = Date.now();
    let full = '';

    try {
      for await (const chunk of provider.streamResponse({
        model: params.model,
        messages: params.history,
        signal: params.signal,
      })) {
        if (chunk.delta) full += chunk.delta;
        if (chunk.done) {
          const promptTokens = await provider.countTokens(
            params.history.map((m) => m.content).join('\n'),
          );
          const completionTokens = await provider.countTokens(full);
          const totalTokens = promptTokens + completionTokens;

          const assistantMessage = await this.messages.append({
            userId: params.userId,
            conversationId: params.conversationId,
            role: 'assistant',
            content: full,
            model: params.model,
            promptTokens,
            completionTokens,
            totalTokens,
          });

          await this.usage.record({
            userId: params.userId,
            conversationId: params.conversationId,
            model: params.model,
            provider: params.provider,
            promptTokens,
            completionTokens,
            totalTokens,
            durationMs: Date.now() - startedAt,
          });

          yield { delta: '', done: true, full };
          void assistantMessage;
          return;
        }
        yield { delta: chunk.delta, done: false, full };
      }
    } catch (err) {
      if (err instanceof ProviderError) {
        await this.usage.record({
          userId: params.userId,
          conversationId: params.conversationId,
          model: params.model,
          provider: params.provider,
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
          durationMs: Date.now() - startedAt,
          status: 'failed',
        });
        throw err;
      }
      throw err;
    }
  }

  private error(message: string, code: string, status: number) {
    const e = new Error(message) as Error & { code: string; status: number };
    e.code = code;
    e.status = status;
    return e;
  }
}
