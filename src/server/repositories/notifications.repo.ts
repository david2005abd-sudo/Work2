import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types/database';

type Client = SupabaseClient<Database>;

export class NotificationsRepository {
  constructor(private readonly db: Client) {}

  async list(params: { userId: string; page: number; pageSize: number; unreadOnly?: boolean }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;

    let q = this.db
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', params.userId)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (params.unreadOnly) q = q.eq('is_read', false);

    const { data, error, count } = await q;
    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }

  async unreadCount(userId: string): Promise<number> {
    const { count, error } = await this.db
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
    return count ?? 0;
  }

  async create(input: TablesInsert<'notifications'>): Promise<Tables<'notifications'>> {
    const { data, error } = await this.db.from('notifications').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async markRead(userId: string, ids: string[]): Promise<void> {
    const { error } = await this.db
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .in('id', ids);
    if (error) throw error;
  }

  async markAllRead(userId: string): Promise<void> {
    const { error } = await this.db
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('is_read', false);
    if (error) throw error;
  }

  async delete(userId: string, id: string): Promise<void> {
    const { error } = await this.db
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('id', id);
    if (error) throw error;
  }
}
