import type { Metadata } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AiModelsRepository } from '@/server/repositories/ai-models.repo';
import { ChatShell } from '@/components/chat/chat-shell';
import { FREE_TIER } from '@/config/constants';

export const metadata: Metadata = {
  title: 'محادثة جديدة',
  robots: { index: false, follow: false },
};

export default async function NewChatPage() {
  const supabase = await createServerSupabaseClient();
  const models = await new AiModelsRepository(supabase).listEnabled();
  const defaultModel = models[0]?.slug ?? 'deepseek-chat';

  return (
    <div className="mx-auto max-w-5xl px-0 sm:px-4">
      <ChatShell models={models} initialModel={defaultModel} />
      <p className="sr-only">الحد المجاني: {FREE_TIER.dailyMessages} رسالة يوميًا</p>
    </div>
  );
}
