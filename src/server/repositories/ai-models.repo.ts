import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '@/types/database';

type Client = SupabaseClient<Database>;

export class AiModelsRepository {
  constructor(private readonly db: Client) {}

  async listEnabled(): Promise<Tables<'ai_models'>[]> {
    const { data, error } = await this.db
      .from('ai_models')
      .select('*')
      .eq('is_enabled', true)
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async listAll(): Promise<Tables<'ai_models'>[]> {
    const { data, error } = await this.db
      .from('ai_models')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) throw error;
    return data ?? [];
  }

  async findBySlug(slug: string): Promise<Tables<'ai_models'> | null> {
    const { data, error } = await this.db
      .from('ai_models')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async update(id: string, patch: Partial<Tables<'ai_models'>>): Promise<Tables<'ai_models'>> {
    const { data, error } = await this.db
      .from('ai_models')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async create(input: Partial<Tables<'ai_models'>> & { slug: string; name: string; provider: string }) {
    const { data, error } = await this.db.from('ai_models').insert(input).select().single();
    if (error) throw error;
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.db.from('ai_models').delete().eq('id', id);
    if (error) throw error;
  }
}
