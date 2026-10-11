import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { ProfilesRepository } from '@/server/repositories/profiles.repo';
import { UsersTable } from '@/components/admin/users-table';

export const metadata: Metadata = {
  title: 'إدارة المستخدمين',
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ page?: string; q?: string }> };

export default async function AdminUsersPage({ searchParams }: Props) {
  const { supabase } = await requireAdmin();
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const search = sp.q;

  const result = await new ProfilesRepository(supabase).list({ page, pageSize: 25, search });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">المستخدمون</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          {result.total} مستخدم إجمالي.
        </p>
      </header>
      <UsersTable users={result.items} page={page} total={result.total} search={search} />
    </div>
  );
}
