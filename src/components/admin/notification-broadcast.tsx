'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';

export function NotificationBroadcast() {
  const [identifier, setIdentifier] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const send = async () => {
    if (!identifier.trim() || !title.trim()) {
      toast.error('أكمل الحقول المطلوبة');
      return;
    }
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .or(`username.eq.${identifier},email.eq.${identifier}`)
        .maybeSingle();

      if (!profile) { toast.error('المستخدم غير موجود'); return; }

      const { error } = await supabase.from('notifications').insert({
        user_id: profile.id,
        title: title.trim(),
        body: body.trim() || null,
        type: 'admin',
      });
      if (error) { toast.error('تعذّر الإرسال'); return; }
      toast.success('تم إرسال الإشعار');
      setTitle(''); setBody('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">المستخدم (اسم المستخدم أو البريد)</Label>
        <Input id="identifier" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="username أو email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">العنوان</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">النص</Label>
        <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={3} />
      </div>
      <Button onClick={send} disabled={submitting} className="gap-2">
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        إرسال
      </Button>
    </div>
  );
}
