'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { localeSchema, type LocaleInput } from '@/lib/validation/settings';

const locales = [
  { value: 'ar', label: 'العربية' },
  { value: 'en', label: 'English' },
] as const;

const timezones = [
  'Asia/Baghdad',
  'Asia/Riyadh',
  'Asia/Dubai',
  'Africa/Cairo',
  'Africa/Casablanca',
  'Europe/London',
  'Europe/Paris',
  'America/New_York',
  'UTC',
];

type Props = { initialLocale: 'ar' | 'en'; initialTimezone: string };

export function LocaleForm({ initialLocale, initialTimezone }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { isDirty } } = useForm<LocaleInput>({
    resolver: zodResolver(localeSchema),
    defaultValues: { locale: initialLocale, timezone: initialTimezone },
  });

  async function onSubmit(data: LocaleInput) {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { error } = await supabase
        .from('profiles')
        .update({ locale: data.locale, timezone: data.timezone })
        .eq('id', user.id);
      if (error) { toast.error('تعذّر الحفظ'); return; }
      toast.success('تم حفظ التغييرات');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>اللغة والمنطقة الزمنية</CardTitle>
        <CardDescription>اختر لغتك والمنطقة الزمنية التي تريد.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="locale">اللغة</Label>
            <select
              id="locale"
              {...register('locale')}
              className="flex h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
            >
              {locales.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="timezone">المنطقة الزمنية</Label>
            <select
              id="timezone"
              {...register('timezone')}
              className="flex h-10 w-full rounded-md border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-sm"
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
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
