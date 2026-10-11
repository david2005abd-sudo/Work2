import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesUpdate } from '@/types/database';

type Client = SupabaseClient<Database>;

export class ProfilesRepository {
  constructor(private readonly db: Client) {}

  async findById(userId: string): Promise<Tables<'profiles'> | null> {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async findByUsername(username: string): Promise<Tables<'profiles'> | null> {
    const { data, error } = await this.db
      .from('profiles')
      .select('*')
      .eq('username', username)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async update(userId: string, patch: TablesUpdate<'profiles'>): Promise<Tables<'profiles'>> {
    const { data, error } = await this.db
      .from('profiles')
      .update(patch)
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async list(params: { page: number; pageSize: number; search?: string; role?: string }) {
    const from = (params.page - 1) * params.pageSize;
    const to = from + params.pageSize - 1;

    let query = this.db
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (params.search) {
      query = query.or(
        `email.ilike.%${params.search}%,username.ilike.%${params.search}%,full_name.ilike.%${params.search}%`,
      );
    }
    if (params.role) query = query.eq('role', params.role);

    const { data, error, count } = await query;
    if (error) throw error;
    return { items: data ?? [], total: count ?? 0 };
  }

  async setActive(userId: string, isActive: boolean) {
    const { error } = await this.db
      .from('profiles')
      .update({ is_active: isActive })
      .eq('id', userId);
    if (error) throw error;
  }

  async setRole(userId: string, role: Tables<'profiles'>['role']) {
    const { error } = await this.db.from('profiles').update({ role }).eq('id', userId);
    if (error) throw error;
  }
}
