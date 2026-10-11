'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Palette, Shield, Globe } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const items = [
  { label: 'الملف الشخصي', href: '/settings/profile', icon: User },
  { label: 'المظهر', href: '/settings/appearance', icon: Palette },
  { label: 'الأمان', href: '/settings/security', icon: Shield },
  { label: 'اللغة والمنطقة', href: '/settings/locale', icon: Globe },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="إعدادات" className="flex gap-1 overflow-x-auto lg:flex-col">
      {items.map((item) => {
        const active = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
              active
                ? 'bg-[color:var(--accent)]/12 text-[color:var(--accent)]'
                : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-elevated)] hover:text-[color:var(--foreground)]',
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
