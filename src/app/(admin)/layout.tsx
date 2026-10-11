import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, avatar_url')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || (profile.role !== 'admin' && profile.role !== 'owner')) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-dvh">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          user={{
            email: user.email ?? null,
            fullName: profile.full_name,
            avatarUrl: profile.avatar_url,
          }}
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
