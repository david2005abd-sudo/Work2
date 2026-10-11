import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

/**
 * Demo mode: lets visitors use the app without registering.
 * Enabled with NEXT_PUBLIC_DEMO_MODE=true. All actions run as a single
 * service-managed demo account and use the admin (service-role) client,
 * which bypasses RLS — never enable this in production with real users.
 */

export const DEMO_EMAIL = 'demo@nados.ai';

export type DemoProfile = {
  id: string;
  role: string;
  full_name: string | null;
  avatar_url: string | null;
};

export type DemoContext = {
  user: User;
  supabase: SupabaseClient<Database>;
  profile: DemoProfile;
};

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export async function getDemoUser(): Promise<DemoContext | null> {
  if (!isDemoMode()) return null;

  const { createAdminSupabaseClient } = await import('@/lib/supabase/server');
  let admin: SupabaseClient<Database>;
  try {
    admin = await createAdminSupabaseClient();
  } catch {
    return null;
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('id, role, full_name, avatar_url')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();
  if (!profile) return null;

  const { data } = await admin.auth.admin.getUserById(profile.id);
  if (!data?.user) return null;

  return { user: data.user, supabase: admin, profile };
}
