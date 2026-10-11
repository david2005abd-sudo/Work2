'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

type Props = { code: string; language?: string };

export function CodeBlock({ code, language }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-[color:var(--border)] bg-[#0b0c10]">
      <div className="flex items-center justify-between border-b border-[color:var(--border)] px-3 py-1.5">
        <span className="font-mono text-[11px] text-[color:var(--muted)]">{language ?? 'text'}</span>
        <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="نسخ الكود">
          {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--success)]" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <pre dir="ltr" className="overflow-x-auto p-3 text-[13px] leading-relaxed">
        <code className="font-mono text-[color:#e5e7eb]">{code}</code>
      </pre>
    </div>
  );
}
