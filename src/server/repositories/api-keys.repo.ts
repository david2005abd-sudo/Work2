import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, TablesInsert } from '@/types/database';

type Client = SupabaseClient<Database>;

export class ApiKeysRepository {
  constructor(private readonly db: Client) {}

  async listForUser(userId: string) {
    const { data, error } = await this.db
      .from('api_keys')
      .select('id, name, key_prefix, scopes, last_used_at, expires_at, revoked_at, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data ?? [];
  }

  async create(input: TablesInsert<'api_keys'>): Promise<Tables<'api_keys'>> {
    const { data, error } = await this.db.from('api_keys').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async findByPrefix(prefix: string): Promise<Tables<'api_keys'> | null> {
    const { data, error } = await this.db
      .from('api_keys')
      .select('*')
      .eq('key_prefix', prefix)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async revoke(userId: string, id: string): Promise<void> {
    const { error } = await this.db
      .from('api_keys')
      .update({ revoked_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('id', id);
    if (error) throw error;
  }

  async touch(prefix: string): Promise<void> {
    await this.db
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('key_prefix', prefix);
  }
}
