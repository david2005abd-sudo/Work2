import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { NotificationBroadcast } from '@/components/admin/notification-broadcast';

export const metadata: Metadata = {
  title: 'إدارة الإشعارات',
  robots: { index: false, follow: false },
};

export default async function AdminNotificationsPage() {
  await requireAdmin();
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">إدارة الإشعارات</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">بث إشعار</CardTitle>
          <CardDescription>أرسل إشعارًا لمستخدم واحد عبر اسم المستخدم أو البريد.</CardDescription>
        </CardHeader>
        <CardContent>
          <NotificationBroadcast />
        </CardContent>
      </Card>
    </div>
  );
}
