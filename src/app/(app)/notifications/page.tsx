import type { Metadata } from 'next';
import { requireUser } from '@/server/guards/require-user';
import { NotificationService } from '@/server/services/notification.service';
import { NotificationsClient } from '@/components/notifications/notifications-client';

export const metadata: Metadata = {
  title: 'الإشعارات',
  robots: { index: false, follow: false },
};

export default async function NotificationsPage() {
  const { user, supabase } = await requireUser();
  const service = new NotificationService(supabase);
  const [result, unread] = await Promise.all([
    service.list(user.id, { page: 1, pageSize: 50 }),
    service.unreadCount(user.id),
  ]);

  return <NotificationsClient items={result.items} unread={unread} />;
}
