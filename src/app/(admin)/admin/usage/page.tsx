import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { UsageService } from '@/server/services/usage.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/utils/format';

export const metadata: Metadata = {
  title: 'مراقبة الاستهلاك',
  robots: { index: false, follow: false },
};

export default async function AdminUsagePage() {
  const { supabase } = await requireAdmin();
  const data = await new UsageService(supabase).platformDaily(30);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">مراقبة الاستهلاك</h1>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">آخر 30 يومًا</CardTitle>
        </CardHeader>
        <CardContent>
          {data.daily.length === 0 ? (
            <p className="py-8 text-center text-sm text-[color:var(--muted)]">لا توجد بيانات.</p>
          ) : (
            <div className="space-y-2">
              {data.daily.map((d) => {
                const max = Math.max(...data.daily.map((x) => x.tokens), 1);
                const pct = (d.tokens / max) * 100;
                return (
                  <div key={d.date} className="flex items-center gap-3 text-xs">
                    <span className="w-24 shrink-0 font-mono text-[color:var(--muted)]">{d.date}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[color:var(--surface-elevated)]">
                      <div className="h-full bg-[color:var(--accent)]" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-20 shrink-0 text-end">{formatNumber(d.tokens)}</span>
                    <span className="w-16 shrink-0 text-end text-[color:var(--muted)]">{d.users} مستخدم</span>
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
