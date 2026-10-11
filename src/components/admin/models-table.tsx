'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { createClient } from '@/lib/supabase/client';
import type { Tables } from '@/types/database';

export function ModelsTable({ models: initial }: { models: Tables<'ai_models'>[] }) {
  const [models, setModels] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (m: Tables<'ai_models'>) => {
    setBusy(m.id);
    try {
      const supabase = createClient();
      await supabase.from('ai_models').update({ is_enabled: !m.is_enabled }).eq('id', m.id);
      setModels((prev) => prev.map((x) => (x.id === m.id ? { ...x, is_enabled: !x.is_enabled } : x)));
      toast.success('تم التحديث');
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[color:var(--border)] text-xs text-[color:var(--muted)]">
                <th className="px-4 py-3 text-start">النموذج</th>
                <th className="px-4 py-3 text-start">المزود</th>
                <th className="px-4 py-3 text-start">السياق</th>
                <th className="px-4 py-3 text-start">مفعّل</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.id} className="border-b border-[color:var(--border)] last:border-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{m.name}</div>
                    <div className="font-mono text-xs text-[color:var(--muted)]">{m.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary">{m.provider}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[color:var(--muted)]">
                    {Intl.NumberFormat('ar').format(m.context_window)}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={m.is_enabled}
                      onCheckedChange={() => toggle(m)}
                      disabled={busy === m.id}
                      aria-label="تفعيل النموذج"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
