import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types/database';

type Client = SupabaseClient<Database>;

export class AuditRepository {
  constructor(private readonly db: Client) {}

  async log(input: TablesInsert<'audit_logs'>): Promise<void> {
    try {
      await this.db.from('audit_logs').insert(input);
    } catch {
      // Audit failures must never break the request.
    }
  }

  async list(params: { page: number; pageSize: number; action?: string; userId?: string }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;
    let q = this.db
      .from('audit_logs')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);
    if (params.action) q = q.eq('action', params.action);
    if (params.userId) q = q.eq('user_id', params.userId);
    const { data, error, count } = await q;
    if (error) throw error;
    return { items: (data ?? []) as Tables<'audit_logs'>[], total: count ?? 0 };
  }
}
