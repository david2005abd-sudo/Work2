import Link from 'next/link';
import { ArrowLeft, Sparkles, Shield, Zap, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';

const features = [
  {
    icon: MessageSquare,
    title: 'محادثات ذكية',
    description: 'حاور نماذج ذكاء اصطناعي متقدمة بواجهة عربية سلسة وردود فورية متدفقة.',
  },
  {
    icon: Zap,
    title: 'بث تدريجي',
    description: 'شاهد الرد يُكتب أمامك كلمة بكلمة دون انتظار حتى يكتمل.',
  },
  {
    icon: Shield,
    title: 'خصوصية وأمان',
    description: 'بياناتك محمية بسياسات وصول دقيقة ومفاتيح API مشفّرة.',
  },
  {
    icon: Sparkles,
    title: 'مجاني للبداية',
    description: 'ابدأ بالاستخدام المجاني اليومي دون بطاقة ائتمانية، وارتقِ عندما تحتاج.',
  },
];

export default function HomePage() {
  return (
    <main className="relative">
      <section className="grid-noise relative overflow-hidden">
        <div className="mx-auto flex max-w-7xl flex-col items-center px-4 pt-20 pb-24 text-center sm:px-6 lg:px-8 lg:pt-28">
          <Badge variant="secondary" className="mb-6 gap-1.5">
            <Sparkles className="h-3 w-3" />
            <span>مدعوم بنماذج متعددة</span>
          </Badge>

          <h1 className="max-w-4xl text-balance text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            محادثات ذكية بـ
            <span className="gradient-text"> العربية</span>، بسرعة وتجربة استثنائية
          </h1>

          <p className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-[color:var(--muted)] sm:text-lg">
            {siteConfig.nameAr} منصة مجانية للحوار مع أفضل نماذج الذكاء الاصطناعي، مع إدارة كاملة
            للمحادثات، البحث، والمكتبة الشخصية.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                ابدأ الآن مجانًا
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                تعرّف على المزيد
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-[color:var(--muted)]">
            لا يلزم بطاقة ائتمانية · استخدمه من المتصفح مباشرة
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">لماذا Nados AI؟</h2>
          <p className="mt-3 text-[color:var(--muted)]">
            كل ما تحتاجه للعمل مع الذكاء الاصطناعي، بتجربة عربية بسيطة.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <Card key={f.title} className="transition-colors hover:border-[color:var(--accent)]/40">
                <CardHeader>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="leading-relaxed">{f.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <Card className="overflow-hidden border-[color:var(--border)] bg-[color:var(--surface-elevated)]">
          <CardContent className="flex flex-col items-center gap-6 px-6 py-12 text-center sm:px-12">
            <h2 className="max-w-2xl text-2xl font-semibold sm:text-3xl">
              جاهز لبدء محادثتك الأولى؟
            </h2>
            <p className="max-w-xl text-[color:var(--muted)]">
              أنشئ حسابك في أقل من دقيقة وابدأ باستخدام المنصة مجانًا.
            </p>
            <Link href="/register">
              <Button size="lg" className="gap-2">
                إنشاء حساب
                <ArrowLeft className="h-4 w-4 rotate-180" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
