import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getDemoUser } from '@/lib/demo';

export async function requireUser() {
  const demo = await getDemoUser();
  if (demo) return { user: demo.user, supabase: demo.supabase };

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  return { user, supabase };
}
