import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types/database';

type Client = SupabaseClient<Database>;

export class UsageRepository {
  constructor(private readonly db: Client) {}

  async create(input: TablesInsert<'usage_records'>): Promise<Tables<'usage_records'>> {
    const { data, error } = await this.db.from('usage_records').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async todayTotals(userId: string) {
    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);

    const { data, error } = await this.db
      .from('usage_records')
      .select('prompt_tokens, completion_tokens, total_tokens')
      .eq('user_id', userId)
      .gte('created_at', dayStart.toISOString());

    if (error) throw error;
    return (data ?? []).reduce(
      (acc, r) => {
        acc.messages += 1;
        acc.promptTokens += r.prompt_tokens ?? 0;
        acc.completionTokens += r.completion_tokens ?? 0;
        acc.totalTokens += r.total_tokens ?? 0;
        return acc;
      },
      { messages: 0, promptTokens: 0, completionTokens: 0, totalTokens: 0 },
    );
  }

  async userDaily(userId: string, days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setUTCHours(0, 0, 0, 0);

    const { data, error } = await this.db
      .from('usage_records')
      .select('created_at, total_tokens, prompt_tokens, completion_tokens')
      .eq('user_id', userId)
      .gte('created_at', since.toISOString())
      .order('created_at', { ascending: true });

    if (error) throw error;

    const byDay = new Map<string, { tokens: number; messages: number }>();
    for (const r of data ?? []) {
      const day = r.created_at.slice(0, 10);
      const cur = byDay.get(day) ?? { tokens: 0, messages: 0 };
      cur.tokens += r.total_tokens ?? 0;
      cur.messages += 1;
      byDay.set(day, cur);
    }
    return Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v }));
  }

  async platformDaily(days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await this.db
      .from('usage_records')
      .select('created_at, total_tokens, user_id, model')
      .gte('created_at', since.toISOString());

    if (error) throw error;

    const byDay = new Map<string, { tokens: number; requests: number; users: Set<string> }>();
    const byModel = new Map<string, { tokens: number; requests: number }>();

    for (const r of data ?? []) {
      const day = r.created_at.slice(0, 10);
      const cur = byDay.get(day) ?? { tokens: 0, requests: 0, users: new Set<string>() };
      cur.tokens += r.total_tokens ?? 0;
      cur.requests += 1;
      cur.users.add(r.user_id);
      byDay.set(day, cur);

      const m = byModel.get(r.model) ?? { tokens: 0, requests: 0 };
      m.tokens += r.total_tokens ?? 0;
      m.requests += 1;
      byModel.set(r.model, m);
    }

    return {
      daily: Array.from(byDay.entries()).map(([date, v]) => ({
        date,
        tokens: v.tokens,
        requests: v.requests,
        users: v.users.size,
      })),
      byModel: Array.from(byModel.entries()).map(([model, v]) => ({ model, ...v })),
    };
  }
}
