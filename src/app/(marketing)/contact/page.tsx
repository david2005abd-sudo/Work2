import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { ContactForm } from '@/components/marketing/contact-form';

export const metadata: Metadata = {
  title: 'تواصل معنا',
  description: 'تواصل مع فريق Nados AI لأي استفسار أو اقتراح.',
  alternates: { canonical: `${siteConfig.url}/contact` },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">تواصل معنا</h1>
        <p className="mt-4 text-[color:var(--muted)]">
          لديك سؤال أو اقتراح؟ يسعدنا أن نسمع منك.
        </p>
      </header>
      <ContactForm />
    </main>
  );
}
