'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeft } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';
import { appNav } from '@/config/nav';
import { cn } from '@/lib/utils/cn';
import { useUIStore } from '@/store/ui-store';

export function AppSidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleCollapsed, sidebarOpen, setSidebarOpen } = useUIStore();

  const collapsed = sidebarCollapsed;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 z-40 flex flex-col border-[color:var(--border)] bg-[color:var(--surface)] transition-all',
          'ltr:left-0 rtl:right-0 ltr:border-r rtl:border-l',
          'md:sticky md:top-0 md:h-dvh md:translate-x-0',
          collapsed ? 'md:w-[68px]' : 'md:w-64',
          'w-64',
          sidebarOpen ? 'translate-x-0' : 'ltr:-translate-x-full rtl:translate-x-full md:translate-x-0',
        )}
        aria-label="التنقل الرئيسي"
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[color:var(--border)] px-4">
          <Logo showText={!collapsed} size="sm" href="/dashboard" />
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden md:inline-flex"
            onClick={toggleCollapsed}
            aria-label={collapsed ? 'توسيع الشريط الجانبي' : 'تصغير الشريط الجانبي'}
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
          <ul className="space-y-1">
            {appNav.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      active
                        ? 'bg-[color:var(--accent)]/12 text-[color:var(--accent)]'
                        : 'text-[color:var(--muted)] hover:bg-[color:var(--surface-elevated)] hover:text-[color:var(--foreground)]',
                      collapsed && 'md:justify-center md:px-0',
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className={cn(collapsed && 'md:hidden')}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-[color:var(--border)] p-3">
          <p className={cn('text-xs text-[color:var(--muted)]', collapsed && 'md:hidden')}>
            النسخة التجريبية
          </p>
        </div>
      </aside>
    </>
  );
}
