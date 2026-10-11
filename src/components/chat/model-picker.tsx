'use client';

import { ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import type { Tables } from '@/types/database';

type Props = {
  models: Tables<'ai_models'>[];
  value: string;
  onChange: (slug: string) => void;
  disabled?: boolean;
};

export function ModelPicker({ models, value, onChange, disabled }: Props) {
  const current = models.find((m) => m.slug === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[color:var(--accent)]" />
          <span className="max-w-[160px] truncate">{current?.name ?? value}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel>اختر النموذج</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {models.map((m) => (
          <DropdownMenuItem
            key={m.slug}
            onSelect={() => onChange(m.slug)}
            className="flex flex-col items-start gap-1 py-2"
          >
            <div className="flex w-full items-center justify-between">
              <span className="font-medium">{m.name}</span>
              <span className="rounded-full bg-[color:var(--surface-elevated)] px-2 py-0.5 text-[10px] text-[color:var(--muted)]">
                {m.provider}
              </span>
            </div>
            {m.description && (
              <span className="text-xs text-[color:var(--muted)]">{m.description}</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
