import Link from 'next/link';
import type { ReactNode } from 'react';
import { Logo } from '@/components/shared/logo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden border-[color:var(--border)] bg-[color:var(--surface)] lg:flex lg:flex-col lg:justify-between lg:border-l rtl:border-l ltr:border-r p-12">
        <div className="grid-noise absolute inset-0 opacity-70" aria-hidden="true" />
        <div className="relative">
          <Logo size="lg" />
        </div>
        <div className="relative max-w-md space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            محادثات ذكية بـ
            <span className="gradient-text"> العربية</span>
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--muted)]">
            انضم إلى Nados AI واستفد من محادثات ذكية، بحث متقدم، وإدارة كاملة لكل محادثاتك — كل
            ذلك مجانًا.
          </p>
        </div>
        <div className="relative text-xs text-[color:var(--muted)]">
          © {new Date().getFullYear()} Nados AI
        </div>
      </aside>

      <main className="flex min-h-dvh items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>
          {children}
          <p className="mt-8 text-center text-xs text-[color:var(--muted)]">
            <Link href="/" className="hover:text-[color:var(--foreground)]">
              ← العودة إلى الرئيسية
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
