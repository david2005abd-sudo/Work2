import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Users, Target, Rocket } from 'lucide-react';

export const metadata: Metadata = {
  title: 'من نحن',
  description: `تعرّف على ${siteConfig.nameAr} — منصة ذكاء اصطناعي عربية مجانية.`,
  alternates: { canonical: `${siteConfig.url}/about` },
};

const values = [
  { icon: Sparkles, title: 'البساطة', body: 'تجربة نظيفة وواضحة تركّز على ما يهم: المحادثة.' },
  { icon: Users, title: 'العربية أولًا', body: 'دعم كامل للغة العربية بواجهة RTL طبيعية.' },
  { icon: Target, title: 'الشفافية', body: 'سياسات خصوصية واضحة، ومفاتيح API مشفّرة، ولا تتبّع خفي.' },
  { icon: Rocket, title: 'الأداء', body: 'بنية سريعة قابلة للتوسع تعمل بسلاسة على كل الأجهزة.' },
];

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">من نحن</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[color:var(--muted)]">
          {siteConfig.nameAr} مشروع يهدف إلى تقديم تجربة ذكاء اصطناعي عربية عالية الجودة،
          بسيطة، ومجانية، للمستخدم العربي في كل مكان.
        </p>
      </header>

      <section className="mb-16 space-y-4">
        <h2 className="text-2xl font-semibold">رسالتنا</h2>
        <p className="leading-relaxed text-[color:var(--muted)]">
          نؤمن بأن أدوات الذكاء الاصطناعي يجب أن تكون متاحة للجميع دون تعقيد. بنينا Nados AI
          ليمنح المستخدم العربي تجربة سلسة، بلغة يفهمها، وبسرعة يستحقها.
        </p>
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-semibold">قيمنا</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <Card key={v.title}>
                <CardContent className="flex gap-4 p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{v.title}</h3>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">{v.body}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </main>
  );
}
