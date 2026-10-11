import { Suspense } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'تسجيل الدخول',
  description: 'سجّل الدخول إلى حسابك في Nados AI',
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">تسجيل الدخول</h1>
        <p className="text-sm text-[color:var(--muted)]">
          مرحبًا بعودتك، أدخل بياناتك للمتابعة.
        </p>
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
      <p className="mt-6 text-center text-sm text-[color:var(--muted)]">
        ليس لديك حساب؟{' '}
        <Link href="/register" className="font-medium text-[color:var(--accent)] hover:underline">
          أنشئ حسابًا مجانًا
        </Link>
      </p>
    </>
  );
}
