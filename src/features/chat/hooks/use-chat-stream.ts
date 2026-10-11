'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useChatStore, type LocalMessage } from '../store';

type SendParams = {
  content: string;
  model: string;
  conversationId?: string;
  systemPrompt?: string;
};

function uid(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);
}

export function useChatStream() {
  const router = useRouter();
  const {
    appendMessage,
    appendDelta,
    updateMessage,
    setStreaming,
    setAbortController,
    setActiveConversation,
  } = useChatStore();

  const send = useCallback(
    async (params: SendParams) => {
      const userClientId = uid();
      const assistantId = uid();

      const userMessage: LocalMessage = {
        id: userClientId,
        role: 'user',
        content: params.content,
        status: 'complete',
        createdAt: new Date().toISOString(),
        clientId: userClientId,
      };
      const assistantMessage: LocalMessage = {
        id: assistantId,
        role: 'assistant',
        content: '',
        status: 'streaming',
        createdAt: new Date().toISOString(),
      };

      appendMessage(userMessage);
      appendMessage(assistantMessage);

      const abort = new AbortController();
      setAbortController(abort);
      setStreaming(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content: params.content,
            model: params.model,
            conversationId: params.conversationId,
            systemPrompt: params.systemPrompt,
            clientMessageId: userClientId,
          }),
          signal: abort.signal,
        });

        if (!res.ok || !res.body) {
          const json = await res.json().catch(() => null);
          throw new Error(json?.error?.message ?? 'فشل الطلب');
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let newConversationId = params.conversationId ?? null;
        let completed = false;

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          const events = buffer.split('\n\n');
          buffer = events.pop() ?? '';

          for (const block of events) {
            if (!block.trim()) continue;
            const lines = block.split('\n');
            let event = 'message';
            let data = '';
            for (const line of lines) {
              if (line.startsWith('event:')) event = line.slice(6).trim();
              else if (line.startsWith('data:')) data += line.slice(5).trim();
            }
            if (!data) continue;
            let parsed: Record<string, unknown>;
            try {
              parsed = JSON.parse(data);
            } catch {
              continue;
            }

            if (event === 'meta') {
              const cid = (parsed.conversationId as string) ?? null;
              newConversationId = cid;
              if (cid) setActiveConversation(cid);
            } else if (event === 'delta') {
              const text = (parsed.text as string) ?? '';
              if (text) appendDelta(assistantId, text);
            } else if (event === 'done') {
              completed = true;
              updateMessage(assistantId, { status: 'complete' });
            } else if (event === 'error') {
              const msg = (parsed.message as string) ?? 'خطأ';
              updateMessage(assistantId, { status: 'failed', content: msg });
              toast.error(msg);
            }
          }
        }

        if (!completed && !abort.signal.aborted) {
          updateMessage(assistantId, { status: 'complete' });
        }

        // First message in a new conversation: navigate to /chat/[id]
        if (newConversationId && !params.conversationId) {
          router.replace(`/chat/${newConversationId}`);
        }
        router.refresh();
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          updateMessage(assistantId, { status: 'failed' });
          toast.error('تعذّر إرسال الرسالة');
        }
      } finally {
        setStreaming(false);
        setAbortController(null);
      }
    },
    [appendDelta, appendMessage, router, setAbortController, setActiveConversation, setStreaming, updateMessage],
  );

  const stop = useCallback(() => {
    const { abortController } = useChatStore.getState();
    abortController?.abort();
    setStreaming(false);
    setAbortController(null);
  }, [setAbortController, setStreaming]);

  return { send, stop };
}
