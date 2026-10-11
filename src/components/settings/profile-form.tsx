'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { profileSchema, type ProfileInput } from '@/lib/validation/settings';

type Props = {
  initialValues: ProfileInput;
  email: string;
};

export function ProfileForm({ initialValues, email }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
  });

  async function onSubmit(data: ProfileInput) {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          username: data.username,
          bio: data.bio || null,
          avatar_url: data.avatarUrl || null,
        })
        .eq('id', (await supabase.auth.getUser()).data.user!.id);
      if (error) {
        toast.error(error.message.includes('username') ? 'اسم المستخدم مستخدم بالفعل' : 'تعذّر الحفظ');
        return;
      }
      toast.success('تم حفظ التغييرات');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>الملف الشخصي</CardTitle>
        <CardDescription>حدّث معلومات حسابك العامة.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input value={email} disabled />
            <p className="text-xs text-[color:var(--muted)]">لا يمكن تغيير البريد الإلكتروني.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">الاسم الكامل</Label>
            <Input id="fullName" {...register('fullName')} aria-invalid={!!errors.fullName} />
            {errors.fullName && <p className="text-xs text-[color:var(--danger)]">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">اسم المستخدم</Label>
            <Input id="username" {...register('username')} aria-invalid={!!errors.username} />
            {errors.username && <p className="text-xs text-[color:var(--danger)]">{errors.username.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="avatarUrl">رابط الصورة الرمزية</Label>
            <Input id="avatarUrl" type="url" placeholder="https://…" {...register('avatarUrl')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">نبذة</Label>
            <Textarea id="bio" rows={3} maxLength={280} {...register('bio')} />
            {errors.bio && <p className="text-xs text-[color:var(--danger)]">{errors.bio.message}</p>}
          </div>
          <Button type="submit" disabled={submitting || !isDirty}>
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            حفظ التغييرات
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
