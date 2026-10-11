import type { Metadata } from 'next';
import { Users, MessageSquare, Activity, Cpu } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { requireAdmin } from '@/server/guards/require-admin';
import { UsageService } from '@/server/services/usage.service';
import { formatNumber } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'لوحة الإدارة',
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();

  const [users, conversations, messages, models, platform] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('conversations').select('*', { count: 'exact', head: true }),
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    supabase.from('ai_models').select('*', { count: 'exact', head: true }).eq('is_enabled', true),
    new UsageService(supabase).platformDaily(14),
  ]);

  const stats = [
    { icon: Users, label: 'المستخدمون', value: formatNumber(users.count ?? 0) },
    { icon: MessageSquare, label: 'المحادثات', value: formatNumber(conversations.count ?? 0) },
    { icon: Activity, label: 'الرسائل', value: formatNumber(messages.count ?? 0) },
    { icon: Cpu, label: 'النماذج المفعّلة', value: formatNumber(models.count ?? 0) },
  ];

  const totals = platform.daily.reduce(
    (acc, d) => ({ tokens: acc.tokens + d.tokens, requests: acc.requests + d.requests }),
    { tokens: 0, requests: 0 },
  );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">نظرة عامة</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          مؤشرات المنصة الرئيسية.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">آخر 14 يومًا</CardTitle>
          </CardHeader>
          <CardContent>
            {platform.daily.length === 0 ? (
              <p className="py-4 text-center text-sm text-[color:var(--muted)]">لا توجد بيانات بعد.</p>
            ) : (
              <>
                <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-md bg-[color:var(--surface-elevated)] p-3">
                    <div className="text-xs text-[color:var(--muted)]">إجمالي التوكنز</div>
                    <div className="mt-1 font-semibold">{formatNumber(totals.tokens)}</div>
                  </div>
                  <div className="rounded-md bg-[color:var(--surface-elevated)] p-3">
                    <div className="text-xs text-[color:var(--muted)]">إجمالي الطلبات</div>
                    <div className="mt-1 font-semibold">{formatNumber(totals.requests)}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  {platform.daily.slice(-7).map((d) => {
                    const max = Math.max(...platform.daily.map((x) => x.tokens), 1);
                    const pct = (d.tokens / max) * 100;
                    return (
                      <div key={d.date} className="flex items-center gap-2 text-xs">
                        <span className="w-24 shrink-0 font-mono text-[color:var(--muted)]">{d.date}</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
                          <div
                            className="h-full bg-[color:var(--accent)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">حسب النموذج</CardTitle>
          </CardHeader>
          <CardContent>
            {platform.byModel.length === 0 ? (
              <p className="py-4 text-center text-sm text-[color:var(--muted)]">لا توجد بيانات.</p>
            ) : (
              <div className="space-y-2">
                {platform.byModel.map((m) => (
                  <div key={m.model} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs">{m.model}</span>
                    <span className="text-[color:var(--muted)]">
                      {formatNumber(m.requests)} طلب · {formatNumber(m.tokens)} توكن
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
