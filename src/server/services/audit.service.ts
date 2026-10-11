import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Json } from '@/types/database';
import { AuditRepository } from '@/server/repositories/audit.repo';
import { hashIp } from '@/lib/security/hash';

export class AuditService {
  private readonly repo: AuditRepository;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new AuditRepository(db);
  }

  async log(params: {
    userId: string | null;
    action: string;
    entityType?: string;
    entityId?: string | null;
    ip?: string | null;
    userAgent?: string | null;
    metadata?: Record<string, unknown>;
  }) {
    await this.repo.log({
      user_id: params.userId,
      action: params.action,
      entity_type: params.entityType ?? null,
      entity_id: params.entityId ?? null,
      ip_hash: hashIp(params.ip),
      user_agent: params.userAgent?.slice(0, 300) ?? null,
      metadata: (params.metadata ?? {}) as Json,
    });
  }
}
