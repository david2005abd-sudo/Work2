import type { Metadata } from 'next';
import { requireUser } from '@/server/guards/require-user';
import { ApiKeyService } from '@/server/services/api-key.service';
import { ApiKeysClient } from '@/components/api-keys/api-keys-client';

export const metadata: Metadata = {
  title: 'مفاتيح API',
  robots: { index: false, follow: false },
};

export default async function ApiKeysPage() {
  const { user, supabase } = await requireUser();
  const keys = await new ApiKeyService(supabase).list(user.id);
  return <ApiKeysClient initialKeys={keys} />;
}
