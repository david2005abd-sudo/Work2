import type { Metadata } from 'next';
import { requireAdmin } from '@/server/guards/require-admin';
import { AiModelsRepository } from '@/server/repositories/ai-models.repo';
import { ModelsTable } from '@/components/admin/models-table';

export const metadata: Metadata = {
  title: 'إدارة النماذج',
  robots: { index: false, follow: false },
};

export default async function AdminModelsPage() {
  const { supabase } = await requireAdmin();
  const models = await new AiModelsRepository(supabase).listAll();
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-2xl font-semibold sm:text-3xl">النماذج</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">إدارة النماذج المتاحة للمستخدمين.</p>
      </header>
      <ModelsTable models={models} />
    </div>
  );
}
