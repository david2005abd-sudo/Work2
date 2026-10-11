import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TablesInsert } from '@/types/database';
import { NotificationsRepository } from '@/server/repositories/notifications.repo';

export class NotificationService {
  private readonly repo: NotificationsRepository;

  constructor(db: SupabaseClient<Database>) {
    this.repo = new NotificationsRepository(db);
  }

  async list(userId: string, params: { page?: number; pageSize?: number; unreadOnly?: boolean }) {
    return this.repo.list({
      userId,
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 20,
      unreadOnly: params.unreadOnly,
    });
  }

  unreadCount(userId: string) {
    return this.repo.unreadCount(userId);
  }

  create(input: TablesInsert<'notifications'>) {
    return this.repo.create(input);
  }

  markRead(userId: string, ids: string[]) {
    return this.repo.markRead(userId, ids);
  }

  markAllRead(userId: string) {
    return this.repo.markAllRead(userId);
  }

  delete(userId: string, id: string) {
    return this.repo.delete(userId, id);
  }
}
