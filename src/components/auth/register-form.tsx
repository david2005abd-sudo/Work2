'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { registerSchema, type RegisterInput } from '@/lib/validation/auth';

export function RegisterForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', username: '', password: '' },
  });

  async function onSubmit(data: RegisterInput) {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName, username: data.username },
          emailRedirectTo: `${window.location.origin}/verify-email`,
        },
      });

      if (error) {
        const msg = error.message.includes('already') ? 'البريد مستخدم بالفعل' : 'تعذّر إنشاء الحساب';
        toast.error(msg);
        return;
      }

      toast.success('تم إنشاء حسابك', { description: 'تحقق من بريدك الإلكتروني لتفعيل الحساب.' });
      router.replace('/verify-email');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="fullName">الاسم الكامل</Label>
        <Input id="fullName" autoComplete="name" placeholder="محمد أحمد" {...register('fullName')} aria-invalid={!!errors.fullName} />
        {errors.fullName && <p className="text-xs text-[color:var(--danger)]">{errors.fullName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">البريد الإلكتروني</Label>
        <Input id="email" type="email" autoComplete="email" placeholder="you@example.com" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="username">اسم المستخدم</Label>
        <Input id="username" autoComplete="username" placeholder="mohammed" {...register('username')} aria-invalid={!!errors.username} />
        {errors.username && <p className="text-xs text-[color:var(--danger)]">{errors.username.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">كلمة المرور</Label>
        <Input id="password" type="password" autoComplete="new-password" placeholder="8 أحرف على الأقل" {...register('password')} aria-invalid={!!errors.password} />
        {errors.password && <p className="text-xs text-[color:var(--danger)]">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitting ? 'جارٍ الإنشاء…' : 'إنشاء الحساب'}
      </Button>

      <p className="text-center text-xs text-[color:var(--muted)]">
        بإنشاء الحساب، أنت توافق على{' '}
        <a href="/terms" className="text-[color:var(--accent)] hover:underline">شروط الاستخدام</a>
        {' '}و{' '}
        <a href="/privacy" className="text-[color:var(--accent)] hover:underline">سياسة الخصوصية</a>.
      </p>
    </form>
  );
}
