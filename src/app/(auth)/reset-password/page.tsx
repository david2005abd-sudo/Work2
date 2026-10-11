import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const metadata: Metadata = {
  title: 'تعيين كلمة مرور جديدة',
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <>
      <div className="mb-6 space-y-2 text-center">
        <h1 className="text-2xl font-semibold">تعيين كلمة مرور جديدة</h1>
        <p className="text-sm text-[color:var(--muted)]">أدخل كلمة المرور الجديدة لحسابك.</p>
      </div>
      <ResetPasswordForm />
    </>
  );
}
