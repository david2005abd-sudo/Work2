'use client';

import Link from 'next/link';
import { Menu, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUIStore } from '@/store/ui-store';

type AppTopbarProps = {
  user: {
    email: string | null;
    fullName: string | null;
    avatarUrl: string | null;
  } | null;
};

export function AppTopbar({ user }: AppTopbarProps) {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);

  const initials =
    (user?.fullName ?? user?.email ?? 'U')
      .split(' ')
      .map((s) => s[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-[color:var(--border)] glass-surface px-4 sm:px-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="فتح القائمة"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Link href="/notifications" aria-label="الإشعارات">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/settings/profile" aria-label="الملف الشخصي">
          <Button variant="ghost" size="icon" className="rounded-full">
            {user ? (
              <Avatar className="h-8 w-8">
                {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt="" /> : null}
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ) : (
              <User className="h-4 w-4" />
            )}
          </Button>
        </Link>
      </div>
    </header>
  );
}
