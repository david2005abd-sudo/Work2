import type { Metadata } from 'next';
import { requireUser } from '@/server/guards/require-user';
import { ProfilesRepository } from '@/server/repositories/profiles.repo';
import { LocaleForm } from '@/components/settings/locale-form';

export const metadata: Metadata = {
  title: 'اللغة والمنطقة',
  robots: { index: false, follow: false },
};

export default async function LocaleSettingsPage() {
  const { user, supabase } = await requireUser();
  const profile = await new ProfilesRepository(supabase).findById(user.id);
  return (
    <LocaleForm
      initialLocale={(profile?.locale as 'ar' | 'en') ?? 'ar'}
      initialTimezone={profile?.timezone ?? 'Asia/Baghdad'}
    />
  );
}
