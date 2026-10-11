import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json, Tables } from '@/types/database';
import { MessagesRepository } from '@/server/repositories/messages.repo';
import { ConversationService } from './conversation.service';

export class MessageService {
  private readonly repo: MessagesRepository;
  private readonly conversations: ConversationService;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new MessagesRepository(db);
    this.conversations = new ConversationService(db);
  }

  async list(userId: string, conversationId: string) {
    await this.conversations.getOwnedOrThrow(conversationId, userId);
    return this.repo.listByConversation(conversationId, { order: 'asc', pageSize: 200 });
  }

  async append(params: {
    userId: string;
    conversationId: string;
    role: Tables<'messages'>['role'];
    content: string;
    model?: string | null;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    clientMessageId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<Tables<'messages'>> {
    return this.repo.create({
      user_id: params.userId,
      conversation_id: params.conversationId,
      role: params.role,
      content: params.content,
      model: params.model ?? null,
      prompt_tokens: params.promptTokens ?? null,
      completion_tokens: params.completionTokens ?? null,
      total_tokens: params.totalTokens ?? null,
      client_message_id: params.clientMessageId ?? null,
      metadata: (params.metadata ?? {}) as Json,
    });
  }

  async search(params: {
    userId: string;
    query: string;
    page?: number;
    pageSize?: number;
    model?: string;
    from?: string;
    to?: string;
  }) {
    return this.repo.search({
      userId: params.userId,
      query: params.query,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      model: params.model,
      from: params.from,
      to: params.to,
    });
  }
}
