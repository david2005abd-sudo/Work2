import type { ReactNode } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getDemoUser } from '@/lib/demo';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const demo = await getDemoUser();

  let user = demo?.user ?? null;
  let profile = demo?.profile ?? null;

  if (!demo) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) redirect('/login?next=/admin');

    const { data } = await supabase
      .from('profiles')
      .select('id, role, full_name, avatar_url')
      .eq('id', authUser.id)
      .maybeSingle();

    if (!data || (data.role !== 'admin' && data.role !== 'owner')) {
      redirect('/dashboard');
    }
    user = authUser;
    profile = data;
  }

  if (!user || !profile) redirect('/login?next=/admin');

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
