'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ModelPicker } from './model-picker';
import { ChatComposer } from './chat-composer';
import { MessageList } from './message-list';
import { EmptyChatState } from './empty-chat-state';
import { useChatStream } from '@/features/chat/hooks/use-chat-stream';
import { useChatStore } from '@/features/chat/store';
import type { Tables } from '@/types/database';

type Props = {
  models: Tables<'ai_models'>[];
  initialModel: string;
  conversationId?: string;
  initialMessages?: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system' | 'tool';
    content: string;
    created_at: string;
  }>;
  systemPrompt?: string | null;
};

export function ChatShell({
  models,
  initialModel,
  conversationId,
  initialMessages = [],
  systemPrompt,
}: Props) {
  const [model, setModel] = useState(initialModel);
  const { send, stop } = useChatStream();
  const { messages, setMessages, streaming, setActiveConversation, activeConversationId } =
    useChatStore();

  useEffect(() => {
    setActiveConversation(conversationId ?? null);
    setMessages(
      initialMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        status: 'complete' as const,
        createdAt: m.created_at,
      })),
    );
  }, [conversationId, initialMessages, setActiveConversation, setMessages]);

  const hasMessages = messages.length > 0;

  const handleSubmit = (text: string) => {
    void send({
      content: text,
      model,
      conversationId: conversationId ?? activeConversationId ?? undefined,
      systemPrompt: systemPrompt ?? undefined,
    });
  };

  const handleRegenerate = useMemo(
    () => (index: number) => {
      const prev = messages[index - 1];
      if (!prev || prev.role !== 'user') {
        toast.error('لا يمكن إعادة التوليد');
        return;
      }
      void send({
        content: prev.content,
        model,
        conversationId: conversationId ?? activeConversationId ?? undefined,
        systemPrompt: systemPrompt ?? undefined,
      });
    },
    [activeConversationId, conversationId, messages, model, send, systemPrompt],
  );

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      <div className="flex items-center justify-between border-b border-[color:var(--border)] bg-[color:var(--surface)] px-4 py-2 sm:px-6">
        <ModelPicker models={models} value={model} onChange={setModel} disabled={streaming} />
        <span className="text-xs text-[color:var(--muted)]">
          {messages.length > 0 && `${messages.length} رسالة`}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {hasMessages ? (
          <MessageList onRegenerate={handleRegenerate} />
        ) : (
          <EmptyChatState onPick={handleSubmit} />
        )}
      </div>

      <ChatComposer
        onSubmit={handleSubmit}
        onStop={stop}
        streaming={streaming}
      />
    </div>
  );
}
