'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUp, Square, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils/cn';

type Props = {
  onSubmit: (content: string) => void;
  onStop: () => void;
  streaming: boolean;
  disabled?: boolean;
};

export function ChatComposer({ onSubmit, onStop, streaming, disabled }: Props) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || streaming || disabled) return;
    onSubmit(trimmed);
    setValue('');
    requestAnimationFrame(() => {
      if (ref.current) {
        ref.current.style.height = 'auto';
      }
    });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="sticky bottom-0 border-t border-[color:var(--border)] bg-[color:var(--background)]/95 backdrop-blur">
      <div className="mx-auto max-w-3xl px-4 py-3 sm:py-4">
        <div className="relative flex items-end gap-2 rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-2 shadow-sm">
          <Button variant="ghost" size="icon" disabled className="shrink-0" aria-label="إرفاق ملف (قريبًا)">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              const el = e.target as HTMLTextAreaElement;
              el.style.height = 'auto';
              el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
            }}
            onKeyDown={onKeyDown}
            placeholder="اكتب رسالتك… (Shift + Enter لسطر جديد)"
            rows={1}
            disabled={disabled}
            className={cn(
              'min-h-[38px] resize-none border-0 bg-transparent px-2 py-2 shadow-none focus-visible:ring-0',
            )}
          />
          {streaming ? (
            <Button
              onClick={onStop}
              size="icon"
              variant="secondary"
              className="shrink-0"
              aria-label="إيقاف التوليد"
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              size="icon"
              className="shrink-0"
              disabled={!value.trim() || disabled}
              aria-label="إرسال"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-center text-[11px] text-[color:var(--muted)]">
          قد يرتكب الذكاء الاصطناعي أخطاء. تحقق من المعلومات المهمة.
        </p>
      </div>
    </div>
  );
}
