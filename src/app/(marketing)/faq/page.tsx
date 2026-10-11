import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { FaqAccordion } from '@/components/marketing/faq-accordion';

export const metadata: Metadata = {
  title: 'الأسئلة الشائعة',
  description: 'إجابات على أكثر الأسئلة شيوعًا حول Nados AI.',
  alternates: { canonical: `${siteConfig.url}/faq` },
};

const faqs = [
  { q: 'هل Nados AI مجاني حقًا؟', a: 'نعم، الاستخدام الأساسي مجاني بحد يومي معقول. يمكنك البدء دون بطاقة ائتمانية.' },
  { q: 'ما النماذج المدعومة؟', a: 'ندعم DeepSeek وOpenAI وGemini. يتم اختيار المزود حسب النموذج تلقائيًا.' },
  { q: 'هل بياناتي آمنة؟', a: 'نعم. نستخدم تشفيرًا كاملًا، سياسات وصول على مستوى الصفوف (RLS)، ومفاتيح API مشفّرة.' },
  { q: 'كيف يتم حساب الاستهلاك؟', a: 'نحسب عدد الرسائل والتوكنز المستخدمة يوميًا. يمكنك متابعة ذلك من لوحة الاستهلاك.' },
  { q: 'هل يمكنني استخدام API في تطبيقي؟', a: 'نعم. يمكنك إنشاء مفاتيح API من صفحة مفاتيح API في حسابك.' },
  { q: 'كيف أحذف حسابي؟', a: 'يمكنك طلب حذف الحساب من صفحة الإعدادات → الأمان. سنحذف كل بياناتك خلال 30 يومًا.' },
];

export default function FaqPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">الأسئلة الشائعة</h1>
        <p className="mt-4 text-[color:var(--muted)]">كل ما تحتاج معرفته عن Nados AI.</p>
      </header>
      <FaqAccordion items={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />
    </main>
  );
}
