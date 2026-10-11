import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDemoUser } from '@/lib/demo';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const demo = await getDemoUser();

  let user = demo?.user ?? null;
  let profile: { full_name: string | null; avatar_url: string | null } | null =
    demo?.profile ?? null;

  if (!demo) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
    if (authUser) {
      const { data } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', authUser.id)
        .maybeSingle();
      profile = data;
    }
  }

  return (
    <div className="flex min-h-dvh">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar
          user={
            user
              ? {
                  email: user.email ?? null,
                  fullName: profile?.full_name ?? null,
                  avatarUrl: profile?.avatar_url ?? null,
                }
              : null
          }
        />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
