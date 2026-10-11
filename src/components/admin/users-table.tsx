'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils/date';
import { useRouter } from 'next/navigation';
import type { Tables } from '@/types/database';

type Props = {
  users: Tables<'profiles'>[];
  page: number;
  total: number;
  search?: string;
};

export function UsersTable({ users: initial, page, total, search }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [q, setQ] = useState(search ?? '');
  const [busy, setBusy] = useState<string | null>(null);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/admin/users?q=${encodeURIComponent(q)}&page=1`);
  };

  const toggleActive = async (u: Tables<'profiles'>) => {
    setBusy(u.id);
    try {
      const supabase = createClient();
      await supabase.from('profiles').update({ is_active: !u.is_active }).eq('id', u.id);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, is_active: !x.is_active } : x)));
      toast.success('تم التحديث');
    } finally {
      setBusy(null);
    }
  };

  const setRole = async (u: Tables<'profiles'>, role: 'user' | 'admin') => {
    setBusy(u.id);
    try {
      const supabase = createClient();
      await supabase.from('profiles').update({ role }).eq('id', u.id);
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role } : x)));
      toast.success('تم تحديث الدور');
    } finally {
      setBusy(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / 25));

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <form onSubmit={submitSearch} className="flex gap-2">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث بالبريد أو اسم المستخدم…"
          />
          <Button type="submit" variant="outline">بحث</Button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-start text-xs text-[color:var(--muted)]">
                <th className="py-3 text-start">المستخدم</th>
                <th className="py-3 text-start">الدور</th>
                <th className="py-3 text-start">الحالة</th>
                <th className="py-3 text-start">التسجيل</th>
                <th className="py-3" />
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-[color:var(--border)] last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {u.avatar_url ? <AvatarImage src={u.avatar_url} alt="" /> : null}
                        <AvatarFallback>
                          {(u.full_name ?? u.email ?? 'U').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{u.full_name ?? '—'}</div>
                        <div className="text-xs text-[color:var(--muted)]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant={u.role === 'user' ? 'secondary' : 'default'}>{u.role}</Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant={u.is_active ? 'success' : 'danger'}>
                      {u.is_active ? 'نشط' : 'معطّل'}
                    </Badge>
                  </td>
                  <td className="py-3 text-xs text-[color:var(--muted)]">
                    {formatDateTime(u.created_at)}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleActive(u)}
                        disabled={busy === u.id}
                      >
                        {busy === u.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : u.is_active ? 'تعطيل' : 'تفعيل'}
                      </Button>
                      {u.role !== 'owner' && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setRole(u, u.role === 'admin' ? 'user' : 'admin')}
                          disabled={busy === u.id}
                        >
                          {u.role === 'admin' ? 'إزالة الإدارة' : 'ترقية لإداري'}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? 'default' : 'outline'}
                size="icon-sm"
                onClick={() => router.push(`/admin/users?page=${p}${search ? `&q=${search}` : ''}`)}
              >
                {p}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
