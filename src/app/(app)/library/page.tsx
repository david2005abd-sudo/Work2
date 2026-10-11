import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, Archive as ArchiveIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { requireUser } from '@/server/guards/require-user';
import { ConversationService } from '@/server/services/conversation.service';
import { formatRelative } from '@/lib/utils/date';

export const metadata: Metadata = {
  title: 'المكتبة',
  robots: { index: false, follow: false },
};

export default async function LibraryPage() {
  const { user, supabase } = await requireUser();
  const service = new ConversationService(supabase);
  const [all, favorites, archived] = await Promise.all([
    service.list({ userId: user.id, page: 1, pageSize: 50 }),
    service.list({ userId: user.id, page: 1, pageSize: 50, onlyFavorites: true }),
    service.list({ userId: user.id, page: 1, pageSize: 50, onlyArchived: true }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold sm:text-3xl">المكتبة</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">
          كل محادثاتك، مثبتاتك، والمؤرشفة.
        </p>
      </header>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">الكل ({all.total})</TabsTrigger>
          <TabsTrigger value="favorites">المثبتة ({favorites.total})</TabsTrigger>
          <TabsTrigger value="archived">المؤرشفة ({archived.total})</TabsTrigger>
        </TabsList>

        {[
          { key: 'all', items: all.items, empty: 'لا توجد محادثات بعد.' },
          { key: 'favorites', items: favorites.items, empty: 'لا توجد محادثات مثبتة.' },
          { key: 'archived', items: archived.items, empty: 'لا توجد محادثات مؤرشفة.' },
        ].map(({ key, items, empty }) => (
          <TabsContent key={key} value={key} className="mt-6">
            {items.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-sm text-[color:var(--muted)]">
                  {empty}
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((c) => (
                  <Link key={c.id} href={`/chat/${c.id}`} className="group">
                    <Card className="h-full transition-colors group-hover:border-[color:var(--accent)]/40">
                      <CardContent className="p-4">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="line-clamp-1 font-medium">{c.title}</h3>
                          <div className="flex shrink-0 items-center gap-1">
                            {c.is_favorite && (
                              <Star className="h-3.5 w-3.5 fill-[color:var(--accent)] text-[color:var(--accent)]" />
                            )}
                            {c.is_archived && <ArchiveIcon className="h-3.5 w-3.5 text-[color:var(--muted)]" />}
                          </div>
                        </div>
                        <p className="mb-3 text-xs text-[color:var(--muted)]">
                          {c.message_count} رسالة ·{' '}
                          {c.last_message_at ? formatRelative(c.last_message_at) : 'جديدة'}
                        </p>
                        <Badge variant="secondary" className="text-[10px]">{c.model}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
