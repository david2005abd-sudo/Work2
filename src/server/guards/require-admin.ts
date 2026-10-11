import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/security/permissions';
import { getDemoUser } from '@/lib/demo';

export async function requireAdmin() {
  const demo = await getDemoUser();
  if (demo) return { user: demo.user, profile: { role: demo.profile.role }, supabase: demo.supabase };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/admin');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !isAdmin(profile.role)) redirect('/dashboard');
  return { user, profile, supabase };
}
