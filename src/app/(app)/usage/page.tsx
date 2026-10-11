import type { Metadata } from 'next';
import { requireUser } from '@/server/guards/require-user';
import { UsageService } from '@/server/services/usage.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'الاستهلاك',
  robots: { index: false, follow: false },
};

export default async function UsagePage() {
  const { user, supabase } = await requireUser();
  const service = new UsageService(supabase);
  const [quota, daily] = await Promise.all([service.checkQuota(user.id), service.userDaily(user.id, 30)]);

  const messagePct = quota.limits.messages ? (quota.used.messages / quota.limits.messages) * 100 : 0;
  const tokenPct = quota.limits.tokens ? (quota.used.tokens / quota.limits.tokens) * 100 : 0;

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">الاستهلاك</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          راقب استخدامك اليومي من الحد المجاني.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[color:var(--muted)]">الرسائل اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {formatNumber(quota.used.messages)} / {formatNumber(quota.limits.messages)}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
              <div
                className="h-full bg-[color:var(--accent)] transition-all"
                style={{ width: `${Math.min(messagePct, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              متبقٍ: {formatNumber(quota.remaining.messages)} رسالة
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[color:var(--muted)]">التوكنز اليوم</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 text-2xl font-semibold">
              {formatNumber(quota.used.tokens)} / {formatNumber(quota.limits.tokens)}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
              <div
                className="h-full bg-[color:var(--accent-blue)] transition-all"
                style={{ width: `${Math.min(tokenPct, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              متبقٍ: {formatNumber(quota.remaining.tokens)} توكن
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>آخر 30 يومًا</CardTitle>
        </CardHeader>
        <CardContent>
          {daily.length === 0 ? (
            <p className="text-center text-sm text-[color:var(--muted)]">لا يوجد نشاط بعد.</p>
          ) : (
            <div className="space-y-2">
              {daily
                .slice()
                .reverse()
                .map((d) => {
                  const max = Math.max(...daily.map((x) => x.tokens), 1);
                  const pct = (d.tokens / max) * 100;
                  return (
                    <div key={d.date} className="flex items-center gap-3 text-xs">
                      <span className="w-24 shrink-0 font-mono text-[color:var(--muted)]">{d.date}</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
                        <div
                          className="h-full bg-gradient-to-r from-[color:var(--accent)] to-[color:var(--accent-blue)]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-end">{formatNumber(d.tokens)}</span>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
