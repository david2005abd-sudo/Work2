import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[color:var(--accent)] text-white',
        secondary:
          'border-[color:var(--border)] bg-[color:var(--surface-elevated)] text-[color:var(--foreground)]',
        outline: 'border-[color:var(--border)] text-[color:var(--foreground)]',
        success:
          'border-transparent bg-[color:var(--success)]/15 text-[color:var(--success)]',
        danger:
          'border-transparent bg-[color:var(--danger)]/15 text-[color:var(--danger)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
