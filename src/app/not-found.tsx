import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/shared/logo';

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-[color:var(--background)] px-6">
      <div className="mx-auto max-w-md text-center">
        <Logo href="/" className="mb-8 inline-flex justify-center" />
        <p className="mb-4 font-mono text-sm text-[color:var(--muted)]">404</p>
        <h1 className="mb-3 text-2xl font-semibold">الصفحة غير موجودة</h1>
        <p className="mb-8 text-sm text-[color:var(--muted)]">
          الرابط الذي تحاول الوصول إليه غير متاح أو تم نقله.
        </p>
        <Link href="/">
          <Button>العودة إلى الرئيسية</Button>
        </Link>
      </div>
    </main>
  );
}
