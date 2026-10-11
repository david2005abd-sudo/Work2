import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FREE_TIER } from '@/config/constants';

export const metadata: Metadata = {
  title: 'إعدادات النظام',
  robots: { index: false, follow: false },
};

export default async function AdminSystemPage() {
  await requireAdmin();

  const info = [
    { label: 'الحد اليومي للرسائل', value: String(FREE_TIER.dailyMessages) },
    { label: 'الحد اليومي للتوكنز', value: String(FREE_TIER.dailyTokens) },
    { label: 'المزود الافتراضي', value: process.env.AI_DEFAULT_PROVIDER ?? 'deepseek' },
    { label: 'البيئة', value: process.env.NODE_ENV ?? 'development' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">إعدادات النظام</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">إعدادات للقراءة فقط في هذه النسخة.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">الإعدادات الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="divide-y divide-[color:var(--border)]">
            {info.map((i) => (
              <div key={i.label} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-[color:var(--muted)]">{i.label}</dt>
                <dd className="font-mono">{i.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
