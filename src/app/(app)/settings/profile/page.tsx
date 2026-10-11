import type { Metadata } from 'next';
import { requireUser } from '@/server/guards/require-user';
import { ProfileForm } from '@/components/settings/profile-form';
import { ProfilesRepository } from '@/server/repositories/profiles.repo';

export const metadata: Metadata = {
  title: 'الملف الشخصي',
  robots: { index: false, follow: false },
};

export default async function ProfileSettingsPage() {
  const { user, supabase } = await requireUser();
  const profile = await new ProfilesRepository(supabase).findById(user.id);

  return (
    <ProfileForm
      initialValues={{
        fullName: profile?.full_name ?? '',
        username: profile?.username ?? '',
        bio: profile?.bio ?? '',
        avatarUrl: profile?.avatar_url ?? '',
      }}
      email={user.email ?? ''}
    />
  );
}
