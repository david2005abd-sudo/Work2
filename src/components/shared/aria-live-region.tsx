'use client';

import { useEffect, useState } from 'react';

/**
 * Global polite live region for screen readers.
 * Components can dispatch `window.dispatchEvent(new CustomEvent('nados:announce', { detail: '...' }))`.
 */
export function AriaLiveRegion() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMessage('');
      setTimeout(() => setMessage(detail), 50);
    };
    window.addEventListener('nados:announce', handler);
    return () => window.removeEventListener('nados:announce', handler);
  }, []);

  return (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
      {message}
    </div>
  );
}
