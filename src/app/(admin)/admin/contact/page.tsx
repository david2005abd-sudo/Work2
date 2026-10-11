import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { ContactRepository } from '@/server/repositories/contact.repo';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date';

export const metadata: Metadata = {
  title: 'رسائل التواصل',
  robots: { index: false, follow: false },
};

export default async function AdminContactPage() {
  const { supabase } = await requireAdmin();
  const { items } = await new ContactRepository(supabase).list({ page: 1, pageSize: 50 });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">رسائل التواصل</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">{items.length} رسالة.</p>
      </header>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-sm text-[color:var(--muted)]">
            لا توجد رسائل بعد.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <Card key={m.id}>
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                  <Badge variant={m.status === 'new' ? 'default' : 'secondary'}>{m.status}</Badge>
                  <span className="font-medium text-[color:var(--foreground)]">{m.name}</span>
                  <span>·</span>
                  <a href={`mailto:${m.email}`} className="text-[color:var(--accent)] hover:underline">{m.email}</a>
                  <span>·</span>
                  <span>{formatDateTime(m.created_at)}</span>
                </div>
                <h3 className="mb-1 font-medium">{m.subject}</h3>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-[color:var(--muted)]">{m.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
