import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'سياسة الخصوصية',
  description: 'سياسة الخصوصية في Nados AI.',
  alternates: { canonical: `${siteConfig.url}/privacy` },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tight">سياسة الخصوصية</h1>
      <div className="prose prose-neutral max-w-none space-y-6 text-[color:var(--muted)]">
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">1. المعلومات التي نجمعها</h2>
          <p className="leading-relaxed">
            نجمع البريد الإلكتروني، اسم المستخدم، ومحتوى المحادثات لتقديم الخدمة. لا نجمع بيانات
            دفع في الإصدار المجاني، ولا نستخدم بياناتك لأي غرض غير تشغيل الخدمة.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">2. كيف نستخدمها</h2>
          <p className="leading-relaxed">
            نستخدم بياناتك لتشغيل حسابك، توليد الردود، حساب الاستهلاك، وإرسال إشعارات مهمة.
            لا نبيع بياناتك لأي طرف ثالث.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">3. الأمان</h2>
          <p className="leading-relaxed">
            نستخدم تشفير TLS لكل الاتصالات، ونطبّق سياسات RLS على قاعدة البيانات، ونخزن مفاتيح
            API كـ hash فقط.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">4. حقوقك</h2>
          <p className="leading-relaxed">
            يمكنك تصدير بياناتك أو حذف حسابك في أي وقت من صفحة الإعدادات.
          </p>
        </section>
        <section>
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--foreground)]">5. التواصل</h2>
          <p className="leading-relaxed">
            لأي استفسار بخصوص الخصوصية، تواصل معنا عبر صفحة <a href="/contact" className="text-[color:var(--accent)] hover:underline">تواصل معنا</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
