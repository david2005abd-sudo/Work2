'use client';

import { Sparkles, Lightbulb, Code2, Languages, FileText } from 'lucide-react';

const suggestions = [
  { icon: Lightbulb, label: 'اشرح لي مفهوم الذكاء الاصطناعي التوليدي بمثال بسيط.' },
  { icon: Code2, label: 'اكتب لي دالة Python تقرأ ملف CSV وترجع ملخصًا.' },
  { icon: Languages, label: 'ترجم هذا النص إلى الإنجليزية مع الحفاظ على المعنى.' },
  { icon: FileText, label: 'ساعدني في كتابة بريد إلكتروني رسمي لطلب إجازة.' },
];

export function EmptyChatState({ onPick }: { onPick: (text: string) => void }) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-blue)] text-white">
        <Sparkles className="h-7 w-7" />
      </div>
      <h2 className="mb-2 text-2xl font-semibold">مرحبًا، كيف أساعدك اليوم؟</h2>
      <p className="mb-8 text-sm text-[color:var(--muted)]">ابدأ بمحادثة جديدة أو اختر اقتراحًا:</p>
      <div className="grid w-full gap-3 sm:grid-cols-2">
        {suggestions.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onPick(s.label)}
              className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] p-4 text-start text-sm transition-colors hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--surface-elevated)]"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--accent)]" />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
