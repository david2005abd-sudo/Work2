import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { AiModelsRepository } from '@/server/repositories/ai-models.repo';
import { ConversationService } from '@/server/services/conversation.service';
import { MessageService } from '@/server/services/message.service';
import { ChatShell } from '@/components/chat/chat-shell';
import { idParamSchema } from '@/lib/validation/common';
import { getDemoUser } from '@/lib/demo';

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const demo = await getDemoUser();
  const supabase = demo?.supabase ?? (await createServerSupabaseClient());
  const { data } = await supabase.from('conversations').select('title').eq('id', id).maybeSingle();
  return {
    title: data?.title ?? 'محادثة',
    robots: { index: false, follow: false },
  };
}

export default async function ConversationPage({ params }: PageProps) {
  const { id } = await params;
  const parsed = idParamSchema.safeParse({ id });
  if (!parsed.success) notFound();

  const demo = await getDemoUser();
  const supabase = demo?.supabase ?? (await createServerSupabaseClient());
  const user = demo?.user ?? (await supabase.auth.getUser()).data.user;
  if (!user) notFound();

  let conversation;
  try {
    conversation = await new ConversationService(supabase).getOwnedOrThrow(id, user.id);
  } catch {
    notFound();
  }

  const [models, messagesResult] = await Promise.all([
    new AiModelsRepository(supabase).listEnabled(),
    new MessageService(supabase).list(user.id, id),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-0 sm:px-4">
      <ChatShell
        models={models}
        initialModel={conversation.model}
        conversationId={conversation.id}
        systemPrompt={conversation.system_prompt}
        initialMessages={messagesResult.items.map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant' | 'system' | 'tool',
          content: m.content,
          created_at: m.created_at,
        }))}
      />
    </div>
  );
}
