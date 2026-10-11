import type { Metadata } from 'next';
import Link from 'next/link';
import { MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'تأكيد البريد الإلكتروني',
  robots: { index: false, follow: false },
};

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
        <MailCheck className="h-8 w-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">تحقق من بريدك الإلكتروني</h1>
        <p className="text-sm text-[color:var(--muted)]">
          أرسلنا لك رابط تأكيد. افتح البريد واضغط الرابط لتفعيل حسابك.
        </p>
      </div>
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-4 text-xs text-[color:var(--muted)]">
        لم يصلك البريد؟ تحقق من مجلد الرسائل غير المرغوب فيها، أو انتظر بضع دقائق.
      </div>
      <Link href="/login" className="block">
        <Button variant="outline" className="w-full">العودة إلى تسجيل الدخول</Button>
      </Link>
    </div>
  );
}
