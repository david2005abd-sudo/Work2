import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { siteConfig } from '@/config/site';

type LogoProps = {
  className?: string;
  showText?: boolean;
  href?: string;
  size?: 'sm' | 'md' | 'lg';
};

export function Logo({ className, showText = true, href = '/', size = 'md' }: LogoProps) {
  const dims = size === 'sm' ? 'h-6 w-6' : size === 'lg' ? 'h-9 w-9' : 'h-7 w-7';
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg';

  const content = (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        className={cn(
          'relative inline-flex items-center justify-center rounded-lg',
          'bg-gradient-to-br from-[color:var(--accent)] to-[color:var(--accent-blue)]',
          'text-white shadow-sm',
          dims,
        )}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
          <path
            d="M4 18V6l8 6 8-6v12"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className={cn('font-semibold tracking-tight', text)}>{siteConfig.name}</span>
      )}
    </span>
  );

  return href ? (
    <Link href={href} aria-label={siteConfig.name}>
      {content}
    </Link>
  ) : (
    content
  );
}
