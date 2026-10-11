import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { AuditRepository } from '@/server/repositories/audit.repo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date';

export const metadata: Metadata = {
  title: 'سجلات الأمان',
  robots: { index: false, follow: false },
};

export default async function AdminSecurityLogsPage() {
  const { supabase } = await requireAdmin();
  const { items } = await new AuditRepository(supabase).list({ page: 1, pageSize: 100 });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">سجلات الأمان</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">آخر 100 عملية حساسة.</p>
      </header>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--border)] text-xs text-[color:var(--muted)]">
                  <th className="px-4 py-3 text-start">التاريخ</th>
                  <th className="px-4 py-3 text-start">العملية</th>
                  <th className="px-4 py-3 text-start">المعرّف</th>
                </tr>
              </thead>
              <tbody>
                {items.map((log) => (
                  <tr key={log.id} className="border-b border-[color:var(--border)] last:border-0">
                    <td className="px-4 py-3 text-xs text-[color:var(--muted)]">
                      {formatDateTime(log.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{log.action}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[color:var(--muted)]">
                      {log.entity_type && log.entity_id
                        ? `${log.entity_type}:${log.entity_id.slice(0, 8)}…`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <p className="py-12 text-center text-sm text-[color:var(--muted)]">لا توجد سجلات بعد.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
