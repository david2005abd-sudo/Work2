import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'شروط الاستخدام',
  description: 'شروط استخدام منصة Nados AI.',
  alternates: { canonical: `${siteConfig.url}/terms` },
};

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">شروط الاستخدام</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-[color:var(--muted)]">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">1. قبول الشروط</h2>
          <p className="leading-relaxed">
            باستخدامك Nados AI، فإنك توافق على هذه الشروط. إذا لم توافق، يُرجى عدم استخدام
            الخدمة.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">2. الاستخدام المقبول</h2>
          <p className="leading-relaxed">
            يجب استخدام الخدمة بشكل قانوني وأخلاقي. يُمنع استخدامها لتوليد محتوى ضار، مضلل،
            أو ينتهك حقوق الآخرين.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">3. الحدود المجانية</h2>
          <p className="leading-relaxed">
            الحد المجاني اليومي عرضة للتعديل. نلتزم بإشعار المستخدم قبل أي تخفيض في الحد.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">4. الملكية الفكرية</h2>
          <p className="leading-relaxed">
            محتواك يبقى ملكك. محتوى المنصة (الاسم، الشعار، الكود) مملوك لـ Nados AI.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">5. إخلاء المسؤولية</h2>
          <p className="leading-relaxed">
            الخدمة مقدّمة &quot;كما هي&quot;. لا نضمن دقة الردود أو استمرارية الخدمة دون انقطاع.
          </p>
        </section>
      </div>
    </main>
  );
}
