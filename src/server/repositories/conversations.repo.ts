import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert, TablesUpdate } from '@/types/database';

type Client = SupabaseClient<Database>;

export class ConversationsRepository {
  constructor(private readonly db: Client) {}

  async findById(id: string): Promise<Tables<'conversations'> | null> {
    const { data, error } = await this.db
      .from('conversations')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async list(params: {
    userId: string;
    page: number;
    pageSize: number;
    includeArchived?: boolean;
    onlyArchived?: boolean;
    onlyFavorites?: boolean;
    search?: string;
  }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;

    let query = this.db
      .from('conversations')
      .select('*', { count: 'exact' })
      .eq('user_id', params.userId)
      .order('is_favorite', { ascending: false })
      .order('updated_at', { ascending: false })
      .range(from, to);

    if (params.onlyArchived) query = query.eq('is_archived', true);
    else if (!params.includeArchived) query = query.eq('is_archived', false);

    if (params.onlyFavorites) query = query.eq('is_favorite', true);
    if (params.search) query = query.ilike('title', `%${params.search}%`);

    const { data, error, count } = await query;
    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }

  async create(input: TablesInsert<'conversations'>): Promise<Tables<'conversations'>> {
    const { data, error } = await this.db.from('conversations').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async update(id: string, patch: TablesUpdate<'conversations'>): Promise<Tables<'conversations'>> {
    const { data, error } = await this.db
      .from('conversations')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('conversations').delete().eq('id', id);
    if (error) throw error;
  }

  async countForUser(userId: string): Promise<number> {
    const { count, error } = await this.db
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_archived', false);
    if (error) throw error;
    return count ?? 0;
  }
}
