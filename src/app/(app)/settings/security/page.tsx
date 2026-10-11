import type { Metadata } from 'next';
import { SecurityForm } from '@/components/settings/security-form';

export const metadata: Metadata = {
  title: 'الأمان',
  robots: { index: false, follow: false },
};

export default function SecuritySettingsPage() {
  return <SecurityForm />;
}
