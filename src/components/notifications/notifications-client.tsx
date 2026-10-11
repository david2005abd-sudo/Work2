'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatRelative } from '@/lib/utils/date';
import type { Tables } from '@/types/database';

type Props = { items: Tables<'notifications'>[]; unread: number };

export function NotificationsClient({ items: initial, unread: initialUnread }: Props) {
  const [items, setItems] = useState(initial);
  const [unread, setUnread] = useState(initialUnread);

  const markAll = async () => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((n) => ({ ...n, is_read: true, read_at: new Date().toISOString() })));
    setUnread(0);
    toast.success('تم تعليم الكل كمقروء');
  };

  const markOne = async (id: string) => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    setUnread((u) => Math.max(u - 1, 0));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">الإشعارات</h1>
          <p className="mt-1 text-sm text-[color:var(--muted)]">
            {unread > 0 ? `لديك ${unread} إشعار غير مقروء` : 'كل الإشعارات مقروءة'}
          </p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={markAll} className="gap-2">
            <CheckCheck className="h-4 w-4" />
            تعليم الكل كمقروء
          </Button>
        )}
      </header>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-12 text-center">
            <Bell className="h-10 w-10 text-[color:var(--muted)]" />
            <p className="text-sm text-[color:var(--muted)]">لا توجد إشعارات بعد.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <div
              key={n.id}
              className={cn(
                'group flex items-start gap-3 rounded-lg border border-[color:var(--border)] p-4 transition-colors',
                n.is_read ? 'bg-[color:var(--surface)]' : 'bg-[color:var(--accent)]/5',
              )}
            >
              <div
                className={cn(
                  'mt-1 h-2 w-2 shrink-0 rounded-full',
                  n.is_read ? 'bg-[color:var(--muted)]/40' : 'bg-[color:var(--accent)]',
                )}
              />
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-medium">{n.title}</h3>
                  {!n.is_read && <Badge variant="secondary">جديد</Badge>}
                </div>
                {n.body && <p className="text-sm text-[color:var(--muted)]">{n.body}</p>}
                <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                  <span>{formatRelative(n.created_at)}</span>
                  {n.action_url && (
                    <Link href={n.action_url} className="text-[color:var(--accent)] hover:underline">
                      فتح
                    </Link>
                  )}
                  {!n.is_read && (
                    <button
                      onClick={() => markOne(n.id)}
                      className="hover:text-[color:var(--foreground)]"
                    >
                      تعليم كمقروء
                    </button>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="حذف" className="opacity-0 group-hover:opacity-100">
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
