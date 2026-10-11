import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types/database';

type Client = SupabaseClient<Database>;

export class ContactRepository {
  constructor(private readonly db: Client) {}

  async create(input: TablesInsert<'contact_messages'>): Promise<Tables<'contact_messages'>> {
    const { data, error } = await this.db.from('contact_messages').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async list(params: { page: number; pageSize: number; status?: string }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;
    let q = this.db
      .from('contact_messages')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (params.status) q = q.eq('status', params.status);
    const { data, error, count } = await q;
    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }

  async updateStatus(id: string, status: Tables<'contact_messages'>['status']): Promise<void> {
    const { error } = await this.db
      .from('contact_messages')
      .update({ status })
      .eq('id', id);
    if (error) throw error;
  }
}
