import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export const metadata: Metadata = {
  title: 'استعادة كلمة المرور',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">استعادة كلمة المرور</h1>
        <p className="text-sm text-[color:var(--muted)]">
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.
        </p>
      </div>
      <ForgotPasswordForm />
    </>
  );
}
