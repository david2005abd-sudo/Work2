'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { adminNav } from '@/config/nav';
import { cn } from '@/lib/utils/cn';

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="sticky top-0 hidden h-dvh w-64 shrink-0 border-[color:var(--border)] bg-[color:var(--surface)] ltr:border-r rtl:border-l lg:flex lg:flex-col"
      aria-label="تنقل الإدارة"
    >
      <div className="flex h-16 items-center gap-2 border-b border-[color:var(--border)] px-4">
        <Logo showText size="sm" href="/admin" />
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-[color:var(--accent)]/15 px-2 py-0.5 text-[10px] font-medium text-[color:var(--accent)] rtl:ml-0 rtl:mr-auto">
          <ShieldCheck className="h-3 w-3" />
          إدارة
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        <ul className="space-y-1">
          {adminNav.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    active
                      ? 'bg-[color:var(--accent)]/12 text-[color:var(--accent)]'
                      : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-elevated)] hover:text-[color:var(--foreground)]',
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-[color:var(--border)] p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-[color:var(--muted)] hover:bg-[color:var(--surface-elevated)]"
        >
          <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
          <span>العودة إلى التطبيق</span>
        </Link>
      </div>
    </aside>
  );
}
