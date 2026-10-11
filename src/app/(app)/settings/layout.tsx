import type { ReactNode } from 'react';
import { SettingsNav } from '@/components/settings/settings-nav';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold sm:text-3xl">الإعدادات</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          إدارة حسابك وتفضيلاتك.
        </p>
      </header>
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <SettingsNav />
        <div>{children}</div>
      </div>
    </div>
  );
}
