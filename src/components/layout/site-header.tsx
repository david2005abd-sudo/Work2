'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ArrowLeft } from 'lucide-react';
import { Logo } from '@/components/shared/logo';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { marketingNav } from '@/config/nav';
import { cn } from '@/lib/utils/cn';

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[color:var(--border)] glass-surface">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="التنقل الرئيسي">
            {marketingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium text-[color:var(--muted)]',
                  'transition-colors hover:text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)]',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login" className="hidden sm:inline-flex">
            <Button variant="ghost" size="sm">
              تسجيل الدخول
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="gap-1.5">
              ابدأ مجانًا
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-[color:var(--border)] bg-[color:var(--surface)] md:hidden"
          aria-label="التنقل للجوال"
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {marketingNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-[color:var(--foreground)] hover:bg-[color:var(--surface-elevated)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
