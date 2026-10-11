'use client';

import { useState } from 'react';
import { KeyRound, Copy, Check, Loader2, Plus, Ban } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils/date';

type ApiKeyItem = {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  last_used_at: string | null;
  expires_at: string | null;
  revoked_at: string | null;
  created_at: string;
};

type Props = { initialKeys: ApiKeyItem[] };

export function ApiKeysClient({ initialKeys }: Props) {
  const [keys, setKeys] = useState(initialKeys);
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const create = async () => {
    if (name.trim().length < 2) { toast.error('اسم المفتاح قصير'); return; }
    setCreating(true);
    try {
      const res = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), scopes: ['chat:read', 'chat:write'] }),
      });
      const json = await res.json();
      if (!json.success) { toast.error(json.error?.message ?? 'تعذّر الإنشاء'); return; }
      setRevealed(json.data.fullKey);
      setName('');
      // Refresh list
      const list = await fetch('/api/api-keys').then((r) => r.json());
      if (list.success) setKeys(list.data);
    } finally {
      setCreating(false);
    }
  };

  const copyKey = async (key: string) => {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const revoke = async (id: string) => {
    if (!confirm('هل أنت متأكد من إلغاء هذا المفتاح؟ لا يمكن التراجع.')) return;
    const res = await fetch(`/api/api-keys/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('تم إلغاء المفتاح');
      setKeys((prev) => prev.map((k) => (k.id === id ? { ...k, revoked_at: new Date().toISOString() } : k)));
    } else toast.error('تعذّر الإلغاء');
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">مفاتيح API</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          أنشئ مفاتيح لاستخدام Nados AI في تطبيقاتك. لن يظهر المفتاح الكامل إلا مرة واحدة.
        </p>
      </header>

      {revealed && (
        <Card className="border-[color:var(--accent)]/40">
          <CardHeader>
            <CardTitle className="text-base">انسخ المفتاح الآن</CardTitle>
            <CardDescription>
              لن تستطيع رؤيته مرة أخرى. احفظه في مكان آمن.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 rounded-md border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-3">
              <code dir="ltr" className="flex-1 overflow-x-auto font-mono text-xs">{revealed}</code>
              <Button size="icon-sm" variant="ghost" onClick={() => copyKey(revealed)} aria-label="نسخ">
                {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => setRevealed(null)}>تم، أخفِ المفتاح</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">إنشاء مفتاح جديد</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 space-y-2">
              <Label htmlFor="keyName">اسم المفتاح</Label>
              <Input
                id="keyName"
                placeholder="مثال: تكامل موقعي"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={create} disabled={creating} className="gap-2">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                إنشاء
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">المفاتيح الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          {keys.length === 0 ? (
            <p className="py-6 text-center text-sm text-[color:var(--muted)]">لا توجد مفاتيح بعد.</p>
          ) : (
            <div className="space-y-3">
              {keys.map((k) => {
                const revoked = !!k.revoked_at;
                const expired = k.expires_at ? new Date(k.expires_at) < new Date() : false;
                return (
                  <div
                    key={k.id}
                    className="flex flex-col gap-2 rounded-lg border border-[color:var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <KeyRound className="h-4 w-4 text-[color:var(--accent)]" />
                        <span className="font-medium">{k.name}</span>
                        {revoked && <Badge variant="danger">ملغى</Badge>}
                        {expired && !revoked && <Badge variant="danger">منتهي</Badge>}
                        {!revoked && !expired && <Badge variant="success">نشط</Badge>}
                      </div>
                      <p className="font-mono text-xs text-[color:var(--muted)]">
                        {k.key_prefix}_…
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        آخر استخدام: {k.last_used_at ? formatDateTime(k.last_used_at) : 'أبدًا'}
                      </p>
                    </div>
                    {!revoked && (
                      <Button variant="outline" size="sm" onClick={() => revoke(k.id)} className="gap-2">
                        <Ban className="h-3.5 w-3.5" />
                        إلغاء
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
