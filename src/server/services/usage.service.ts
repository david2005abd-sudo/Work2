import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { UsageRepository } from '@/server/repositories/usage.repo';
import { ProfilesRepository } from '@/server/repositories/profiles.repo';
import { FREE_TIER } from '@/config/constants';

export class UsageService {
  private readonly repo: UsageRepository;
  private readonly profiles: ProfilesRepository;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new UsageRepository(db);
    this.profiles = new ProfilesRepository(db);
  }

  async record(input: {
    userId: string;
    conversationId?: string | null;
    model: string;
    provider: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    durationMs: number;
    status?: string;
  }) {
    return this.repo.create({
      user_id: input.userId,
      conversation_id: input.conversationId ?? null,
      model: input.model,
      provider: input.provider,
      prompt_tokens: input.promptTokens,
      completion_tokens: input.completionTokens,
      total_tokens: input.totalTokens,
      request_duration_ms: input.durationMs,
      request_status: input.status ?? 'success',
    });
  }

  async checkQuota(userId: string): Promise<{
    allowed: boolean;
    used: { messages: number; tokens: number };
    limits: { messages: number; tokens: number };
    remaining: { messages: number; tokens: number };
  }> {
    const profile = await this.profiles.findById(userId);
    const messageLimit = profile?.daily_message_limit ?? FREE_TIER.dailyMessages;
    const tokenLimit = profile?.daily_token_limit ?? FREE_TIER.dailyTokens;

    const totals = await this.repo.todayTotals(userId);
    const remainingMessages = Math.max(messageLimit - totals.messages, 0);
    const remainingTokens = Math.max(tokenLimit - totals.totalTokens, 0);

    return {
      allowed: remainingMessages > 0 && remainingTokens > 0,
      used: { messages: totals.messages, tokens: totals.totalTokens },
      limits: { messages: messageLimit, tokens: tokenLimit },
      remaining: { messages: remainingMessages, tokens: remainingTokens },
    };
  }

  async userDaily(userId: string, days = 30) {
    return this.repo.userDaily(userId, days);
  }

  async platformDaily(days = 30) {
    return this.repo.platformDaily(days);
  }
}
