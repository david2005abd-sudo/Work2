import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { ApiKeysRepository } from '@/server/repositories/api-keys.repo';
import { generateApiKey, safeEqual, sha256 } from '@/lib/security/hash';
import type { CreateApiKeyInput } from '@/lib/validation/api-keys';

export class ApiKeyService {
  private readonly repo: ApiKeysRepository;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new ApiKeysRepository(db);
  }

  list(userId: string) {
    return this.repo.listForUser(userId);
  }

  async create(userId: string, input: CreateApiKeyInput) {
    const key = generateApiKey();
    const expiresAt = input.expiresInDays
      ? new Date(Date.now() + input.expiresInDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    await this.repo.create({
      user_id: userId,
      name: input.name,
      key_prefix: key.prefix,
      key_hash: key.hash,
      scopes: input.scopes,
      expires_at: expiresAt,
    });

    // The full key is returned ONLY here — it is never stored in plaintext.
    return { fullKey: key.full, prefix: key.prefix };
  }

  async revoke(userId: string, id: string) {
    return this.repo.revoke(userId, id);
  }

  async verify(rawKey: string): Promise<{ userId: string; scopes: string[] } | null> {
    const parts = rawKey.split('_');
    if (parts.length < 3) return null;
    const prefix = `${parts[0]}_${parts[1]}`;
    const record = await this.repo.findByPrefix(prefix);
    if (!record || record.revoked_at) return null;
    if (record.expires_at && new Date(record.expires_at) < new Date()) return null;

    const hash = sha256(rawKey);
    if (!safeEqual(hash, record.key_hash)) return null;

    await this.repo.touch(prefix);
    return { userId: record.user_id, scopes: record.scopes };
  }
}
