'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw, ThumbsUp, ThumbsDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/shared/logo';
import { MarkdownRenderer } from './markdown-renderer';
import { cn } from '@/lib/utils/cn';
import type { LocalMessage } from '@/features/chat/store';

type Props = {
  message: LocalMessage;
  onRegenerate?: () => void;
};

export function MessageItem({ message, onRegenerate }: Props) {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const isUser = message.role === 'user';

  const copy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article
      className={cn(
        'group flex gap-3 px-4 py-4 sm:gap-4 sm:px-6',
        isUser && 'bg-[color:var(--surface)]/40',
      )}
    >
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-blue)]">
            <Logo showText={false} size="sm" href={undefined} />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-2 text-xs text-[color:var(--muted)]">
          <span className="font-medium text-[color:var(--foreground)]">
            {isUser ? 'أنت' : 'Nados AI'}
          </span>
          {message.status === 'streaming' && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1 w-1 animate-pulse rounded-full bg-[color:var(--accent)]" />
              يكتب…
            </span>
          )}
        </div>

        <div className="prose-sm max-w-none">
          {isUser ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {message.status !== 'streaming' && message.content && (
          <div className="mt-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="نسخ">
              {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
            </Button>
            {!isUser && onRegenerate && (
              <Button variant="ghost" size="icon-sm" onClick={onRegenerate} aria-label="إعادة التوليد">
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            )}
            {!isUser && (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setRating('up')}
                  aria-label="إعجاب"
                  className={cn(rating === 'up' && 'text-[color:var(--success)]')}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setRating('down')}
                  aria-label="عدم إعجاب"
                  className={cn(rating === 'down' && 'text-[color:var(--danger)]')}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
