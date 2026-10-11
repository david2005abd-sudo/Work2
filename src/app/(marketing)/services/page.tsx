import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Search, Library, KeyRound, BarChart3, Bell } from 'lucide-react';

export const metadata: Metadata = {
  title: 'الخدمات',
  description: 'اكتشف خدمات Nados AI: محادثة ذكية، بحث، مكتبة، API للمطورين.',
  alternates: { canonical: `${siteConfig.url}/services` },
};

const services = [
  { icon: MessageSquare, title: 'محادثة ذكية', description: 'حاور أفضل نماذج الذكاء الاصطناعي ببث فوري وواجهة عربية سلسة.' },
  { icon: Search, title: 'بحث داخلي', description: 'ابحث في كل محادثاتك بكلمات مفتاحية مع فلاتر متقدمة.' },
  { icon: Library, title: 'المكتبة', description: 'احفظ النتائج المهمة ونظّمها للرجوع إليها لاحقًا.' },
  { icon: KeyRound, title: 'API للمطورين', description: 'مفاتيح API آمنة مبنية للاستخدام في تطبيقاتك.' },
  { icon: BarChart3, title: 'تقارير الاستهلاك', description: 'لوحة استهلاك دقيقة تعرض التوكنز والرسائل اليومية.' },
  { icon: Bell, title: 'إشعارات ذكية', description: 'تنبيهات عند الوصول لحدود الاستهلاك أو الأحداث المهمة.' },
];

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">الخدمات</h1>
        <p className="mx-auto mt-4 max-w-2xl text-[color:var(--muted)]">
          كل ما تحتاجه للعمل مع الذكاء الاصطناعي في مكان واحد.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.title} className="transition-colors hover:border-[color:var(--accent)]/40">
              <CardHeader>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[color:var(--accent)]/12 text-[color:var(--accent)]">
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{s.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-sm text-[color:var(--muted)]">
                {s.description}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-16 text-center">
        <Link href="/register">
          <Button size="lg">ابدأ الآن مجانًا</Button>
        </Link>
      </div>
    </main>
  );
}
