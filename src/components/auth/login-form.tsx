'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { loginSchema, type LoginInput } from '@/lib/validation/auth';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: '', password: '' } });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        toast.error('فشل تسجيل الدخول', { description: 'تأكد من البريد وكلمة المرور.' });
        return;
      }
      const next = params.get('next') ?? '/dashboard';
      router.replace(next);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <div className="relative">
          <Mail className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)] ltr:left-3 rtl:right-3" />
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className="ltr:pl-9 rtl:pr-9"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">كلمة المرور</Label>
          <Link href="/forgot-password" className="text-xs text-[color:var(--accent)] hover:underline">
            نسيت كلمة المرور؟
          </Link>
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)] ltr:left-3 rtl:right-3" />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="ltr:pl-9 rtl:pr-9"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
        </div>
        {errors.password && <p className="text-xs text-[color:var(--danger)]">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? 'جارٍ الدخول…' : 'تسجيل الدخول'}
      </Button>
    </form>
  );
}
