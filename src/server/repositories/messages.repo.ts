import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';

type Client = SupabaseClient<Database>;

export class MessagesRepository {
  constructor(private readonly db: Client) {}

  async listByConversation(
    conversationId: string,
    params: { page?: number; pageSize?: number; order?: 'asc' | 'desc' } = {},
  ) {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 100;
    const order = params.order ?? 'asc';
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error, count } = await this.db
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: order === 'asc' })
      .range(from, to);

    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }

  async create(input: TablesInsert<'messages'>): Promise<Tables<'messages'>> {
    const { data, error } = await this.db.from('messages').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, patch: TablesUpdate<'messages'>): Promise<Tables<'messages'>> {
    const { data, error } = await this.db
      .from('messages')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('messages').delete().eq('id', id);
    if (error) throw error;
  }

  async search(params: {
    userId: string;
    query: string;
    page: number;
    pageSize: number;
    model?: string;
    from?: string;
    to?: string;
  }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;

    let query = this.db
      .from('messages')
      .select('*, conversations!inner(id, title, model, is_archived)', { count: 'exact' })
      .eq('user_id', params.userId)
      .ilike('content', `%${params.query}%`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (params.model) query = query.eq('model', params.model);
    if (params.from) query = query.gte('created_at', params.from);
    if (params.to) query = query.lte('created_at', params.to);

    const { data, error, count } = await query;
    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }
}
