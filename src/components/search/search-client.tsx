'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDebounce } from '@/hooks/use-debounce';
import { truncate } from '@/lib/utils/format';
import { formatDateTime } from '@/lib/utils/date';

type Result = {
  id: string;
  content: string;
  role: string;
  created_at: string;
  conversation_id: string;
  model: string | null;
  conversations: { id: string; title: string } | null;
};

export function SearchClient() {
  const [q, setQ] = useState('');
  const debounced = useDebounce(q, 300);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (debounced.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debounced)}&pageSize=30`);
        const json = await res.json();
        if (!cancelled && json.success) setResults(json.data.items);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setSearched(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">البحث في المحادثات</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          ابحث في نصوص كل رسائلك.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)] ltr:left-3 rtl:right-3" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="ابحث في رسائلك…"
          autoFocus
          className="ltr:pl-9 rtl:pr-9"
        />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-[color:var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          جارٍ البحث…
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <p className="text-center text-sm text-[color:var(--muted)]">
          لا توجد نتائج مطابقة.
        </p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <Link key={r.id} href={`/chat/${r.conversation_id}`}>
            <Card className="transition-colors hover:border-[color:var(--accent)]/40">
              <CardContent className="p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-[color:var(--muted)]">
                  <Badge variant="secondary">{r.role === 'user' ? 'أنت' : 'AI'}</Badge>
                  <span>{r.conversations?.title ?? 'محادثة'}</span>
                  <span>·</span>
                  <span>{formatDateTime(r.created_at)}</span>
                </div>
                <p className="text-sm leading-relaxed">{truncate(r.content, 240)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
