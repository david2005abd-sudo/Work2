import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'إنشاء حساب',
  description: 'أنشئ حسابك المجاني في Nados AI',
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">إنشاء حساب جديد</h1>
        <p className="text-sm text-[color:var(--muted)]">ابدأ مجانًا في أقل من دقيقة.</p>
      </div>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        لديك حساب بالفعل؟{' '}
        <Link href="/login" className="font-medium text-[color:var(--accent)] hover:underline">
          سجّل الدخول
        </Link>
      </p>
    </>
  );
}
