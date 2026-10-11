import { vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

export type QueryResult<T> = {
  data: T | null;
  error: unknown;
  count?: number | null;
};

/** Builds a chainable Supabase client mock supporting the fluent API. */
export function createSupabaseMock() {
  const calls: Array<{ table?: string; method: string; args: unknown[] }> = [];

  function builder(result: QueryResult<unknown> = { data: null, error: null }) {
    const chain: Record<string, unknown> = {};
    const methods = [
      'select', 'insert', 'update', 'delete', 'upsert',
      'eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'in', 'is', 'or', 'ilike', 'like',
      'order', 'range', 'limit', 'single', 'maybeSingle', 'head',
    ];
    for (const m of methods) {
      chain[m] = vi.fn((...args: unknown[]) => {
        calls.push({ method: m, args });
        return chain;
      });
    }
    chain.then = (resolve: (r: QueryResult<unknown>) => void) => Promise.resolve(result).then(resolve);
    chain.catch = (rej: (e: unknown) => void) => Promise.resolve(result).catch(rej);
    return chain;
  }

  const from = vi.fn((table: string) => {
    calls.push({ table, method: 'from', args: [] });
    return builder({ data: [], error: null, count: 0 });
  });

  const client = {
    from,
    auth: {
      getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
      signInWithPassword: vi.fn(async () => ({ data: { user: null }, error: null })),
      signUp: vi.fn(async () => ({ data: { user: null }, error: null })),
      signOut: vi.fn(async () => ({ error: null })),
    },
  } as unknown as SupabaseClient<Database>;

  return { client, calls };
}
