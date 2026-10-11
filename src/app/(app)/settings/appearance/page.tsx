import type { Metadata } from 'next';
import { AppearanceForm } from '@/components/settings/appearance-form';

export const metadata: Metadata = {
  title: 'المظهر',
  robots: { index: false, follow: false },
};

export default function AppearanceSettingsPage() {
  return <AppearanceForm />;
}
