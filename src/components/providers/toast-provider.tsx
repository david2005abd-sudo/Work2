'use client';

import { Toaster } from 'sonner';
import { useTheme } from 'next-themes';

export function ToastProvider() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-center"
      theme={(theme as 'light' | 'dark' | 'system') ?? 'system'}
      richColors
      closeButton
      toastOptions={{ className: 'font-sans' }}
    />
  );
}
