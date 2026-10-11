import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/types/database';
import { ConversationsRepository } from '@/server/repositories/conversations.repo';
import type { CreateConversationInput, UpdateConversationInput } from '@/lib/validation/chat';

export class ConversationService {
  private readonly repo: ConversationsRepository;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new ConversationsRepository(db);
  }

  async getOwnedOrThrow(conversationId: string, userId: string): Promise<Tables<'conversations'>> {
    const conv = await this.repo.findById(conversationId);
    if (!conv || conv.user_id !== userId) {
      const err = new Error('المحادثة غير موجودة') as Error & { code: string; status: number };
      err.code = 'not_found';
      err.status = 404;
      throw err;
    }
    return conv;
  }

  async list(params: {
    userId: string;
    page?: number;
    pageSize?: number;
    includeArchived?: boolean;
    onlyArchived?: boolean;
    onlyFavorites?: boolean;
    search?: string;
  }) {
    return this.repo.list({
      userId: params.userId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      includeArchived: params.includeArchived,
      onlyArchived: params.onlyArchived,
      onlyFavorites: params.onlyFavorites,
      search: params.search,
    });
  }

  async create(userId: string, input: CreateConversationInput): Promise<Tables<'conversations'>> {
    return this.repo.create({
      user_id: userId,
      title: input.title ?? 'محادثة جديدة',
      model: input.model,
      system_prompt: input.systemPrompt ?? null,
    });
  }

  async update(
    userId: string,
    conversationId: string,
    input: UpdateConversationInput,
  ): Promise<Tables<'conversations'>> {
    await this.getOwnedOrThrow(conversationId, userId);
    const patch: Partial<Tables<'conversations'>> = {};
    if (input.title !== undefined) patch.title = input.title;
    if (input.isArchived !== undefined) patch.is_archived = input.isArchived;
    if (input.isFavorite !== undefined) patch.is_favorite = input.isFavorite;
    if (input.systemPrompt !== undefined) patch.system_prompt = input.systemPrompt;
    return this.repo.update(conversationId, patch);
  }

  async delete(userId: string, conversationId: string): Promise<void> {
    await this.getOwnedOrThrow(conversationId, userId);
    await this.repo.delete(conversationId);
  }

  async autoTitle(conversationId: string, firstUserMessage: string): Promise<void> {
    const conv = await this.repo.findById(conversationId);
    if (!conv || conv.title !== 'محادثة جديدة') return;
    const title = firstUserMessage.replace(/\s+/g, ' ').trim().slice(0, 60);
    if (title) await this.repo.update(conversationId, { title });
  }
}
