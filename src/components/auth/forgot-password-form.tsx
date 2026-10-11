'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/lib/validation/auth';

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  async function onSubmit(data: ForgotPasswordInput) {
    setSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSent(true);
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-6 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-[color:var(--success)]" />
        <h2 className="mb-1 font-medium">تم الإرسال</h2>
        <p className="text-sm text-[color:var(--muted)]">
          إذا كان البريد مسجلًا لدينا، فستصلك رسالة تحتوي على رابط إعادة التعيين خلال دقائق.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        إرسال رابط الاستعادة
      </Button>
    </form>
  );
}
