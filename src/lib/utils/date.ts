const AR_LOCALE = 'ar';

export function formatDate(date: string | Date, locale = AR_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatDateTime(date: string | Date, locale = AR_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export function formatRelative(date: string | Date, locale = AR_LOCALE): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = d.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const abs = Math.abs(diff);
  const minutes = Math.round(diff / 60_000);
  if (abs < 60_000) return rtf.format(Math.round(diff / 1000), 'second');
  if (abs < 3_600_000) return rtf.format(minutes, 'minute');
  if (abs < 86_400_000) return rtf.format(Math.round(minutes / 60), 'hour');
  if (abs < 2_592_000_000) return rtf.format(Math.round(minutes / 60 / 24), 'day');
  return rtf.format(Math.round(minutes / 60 / 24 / 30), 'month');
}
