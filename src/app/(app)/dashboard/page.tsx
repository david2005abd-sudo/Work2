import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, BarChart3, Bell, KeyRound, Plus, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { requireUser } from '@/server/guards/require-user';
import { ConversationService } from '@/server/services/conversation.service';
import { UsageService } from '@/server/services/usage.service';
import { NotificationService } from '@/server/services/notification.service';
import { formatNumber } from '@/lib/utils/format';
import { formatRelative } from '@/lib/utils/date';

export const metadata: Metadata = {
  title: 'لوحة التحكم',
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const { user, supabase } = await requireUser();
  const [convs, quota, unread] = await Promise.all([
    new ConversationService(supabase).list({ userId: user.id, page: 1, pageSize: 6 }),
    new UsageService(supabase).checkQuota(user.id),
    new NotificationService(supabase).unreadCount(user.id),
  ]);

  const stats = [
    {
      icon: MessageSquare,
      label: 'المحادثات',
      value: formatNumber(convs.total),
      sub: 'إجمالي محادثاتك',
    },
    {
      icon: BarChart3,
      label: 'الرسائل اليوم',
      value: `${formatNumber(quota.used.messages)} / ${formatNumber(quota.limits.messages)}`,
      sub: 'الاستهلاك اليومي',
    },
    {
      icon: Bell,
      label: 'إشعارات غير مقروءة',
      value: formatNumber(unread),
      sub: 'انظر الإشعارات',
    },
    {
      icon: KeyRound,
      label: 'التوكنز اليوم',
      value: `${formatNumber(quota.used.tokens)} / ${formatNumber(quota.limits.tokens)}`,
      sub: 'من الحد اليومي',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            مرحبًا، استعرض نشاطك وابدأ محادثة جديدة.
          </p>
        </div>
        <Link href="/chat/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            محادثة جديدة
          </Button>
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[color:var(--muted)]">
                  {s.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-[color:var(--muted)]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{s.value}</div>
                <p className="mt-1 text-xs text-[color:var(--muted)]">{s.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">أحدث المحادثات</h2>
          <Link
            href="/library"
            className="text-sm text-[color:var(--accent)] hover:underline"
          >
            عرض الكل
          </Link>
        </div>
        {convs.items.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <Archive className="h-10 w-10 text-[color:var(--muted)]" />
              <p className="text-sm text-[color:var(--muted)]">لا توجد محادثات بعد.</p>
              <Link href="/chat/new">
                <Button size="sm" className="gap-2">
                  <Plus className="h-3.5 w-3.5" />
                  ابدأ أول محادثة
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {convs.items.map((c) => (
              <Link key={c.id} href={`/chat/${c.id}`} className="group">
                <Card className="h-full transition-colors group-hover:border-[color:var(--accent)]/40">
                  <CardContent className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 font-medium">{c.title}</h3>
                      {c.is_favorite && <Badge variant="secondary">مثبتة</Badge>}
                    </div>
                    <p className="text-xs text-[color:var(--muted)]">
                      {c.message_count} رسالة ·{' '}
                      {c.last_message_at ? formatRelative(c.last_message_at) : 'جديدة'}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
