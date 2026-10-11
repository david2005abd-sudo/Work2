'use client';

import { useEffect, useRef } from 'react';
import { MessageItem } from './message-item';
import type { LocalMessage } from '@/features/chat/store';
import { useChatStore } from '@/features/chat/store';

type Props = {
  onRegenerate?: (index: number) => void;
};

export function MessageList({ onRegenerate }: Props) {
  const messages = useChatStore((s) => s.messages);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length, messages[messages.length - 1]?.content]);

  return (
    <div className="mx-auto max-w-3xl">
      {messages.map((m, i) => (
        <MessageItem
          key={m.id}
          message={m}
          onRegenerate={m.role === 'assistant' ? () => onRegenerate?.(i) : undefined}
        />
      ))}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}

export type { LocalMessage };
