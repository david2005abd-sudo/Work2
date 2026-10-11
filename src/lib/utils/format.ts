export function formatNumber(value: number, locale = 'ar'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompact(value: number, locale = 'ar'): string {
  return new Intl.NumberFormat(locale, { notation: 'compact', maximumFractionDigits: 1 }).format(
    value,
  );
}

export function formatBytes(bytes: number, locale = 'ar'): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(
    bytes / Math.pow(1024, i),
  )} ${units[i]}`;
}

export function truncate(text: string, max = 80): string {
  if (text.length <= max) return text;
  return text.slice(0, max - 1) + '…';
}
