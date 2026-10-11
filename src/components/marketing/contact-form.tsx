'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Send, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { contactSchema, type ContactInput } from '@/lib/validation/contact';

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: '', message: '' },
  });

  async function onSubmit(data: ContactInput) {
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error('تعذّر الإرسال', { description: json.error?.message });
        return;
      }
      setSent(true);
      reset();
    } catch {
      toast.error('حدث خطأ أثناء الإرسال');
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-[color:var(--border)] bg-[color:var(--surface-elevated)] p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-[color:var(--success)]" />
        <h2 className="mb-2 text-lg font-medium">تم استلام رسالتك</h2>
        <p className="text-sm text-[color:var(--muted)]">سنرد عليك في أقرب وقت ممكن.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-lg border border-[color:var(--border)] bg-[color:var(--surface)] p-6 sm:p-8" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">الاسم</Label>
          <Input id="name" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
          {errors.name && <p className="text-xs text-[color:var(--danger)]">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input id="email" type="email" autoComplete="email" {...register('email')} aria-invalid={!!errors.email} />
          {errors.email && <p className="text-xs text-[color:var(--danger)]">{errors.email.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">الموضوع</Label>
        <Input id="subject" {...register('subject')} aria-invalid={!!errors.subject} />
        {errors.subject && <p className="text-xs text-[color:var(--danger)]">{errors.subject.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">الرسالة</Label>
        <Textarea id="message" rows={6} {...register('message')} aria-invalid={!!errors.message} />
        {errors.message && <p className="text-xs text-[color:var(--danger)]">{errors.message.message}</p>}
      </div>
      <Button type="submit" disabled={submitting} className="w-full gap-2">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        إرسال الرسالة
      </Button>
    </form>
  );
}
