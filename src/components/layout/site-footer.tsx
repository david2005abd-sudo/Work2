import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { siteConfig } from '@/config/site';
import { marketingNav } from '@/config/nav';

const legalLinks = [
  { label: 'سياسة الخصوصية', href: '/privacy' },
  { label: 'شروط الاستخدام', href: '/terms' },
  { label: 'حالة الخدمة', href: '/status' },
] as const;

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[color:var(--border)] bg-[color:var(--surface)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div className="space-y-3 md:col-span-2">
          <Logo />
          <p className="max-w-md text-sm leading-relaxed text-[color:var(--muted)]">
            {siteConfig.description}
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">المنصة</h3>
          <ul className="space-y-2 text-sm">
            {marketingNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold">قانوني</h3>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[color:var(--border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-[color:var(--muted)] sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {year} {siteConfig.nameAr}. جميع الحقوق محفوظة.
          </p>
          <p>
            صُنع بشغف للمستخدم العربي.
          </p>
        </div>
      </div>
    </footer>
  );
}
