/** Strip control chars & neutralize leading formula characters. */
export function sanitizeText(input: string, maxLength?: number): string {
  let out = input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  // Prevent CSV formula injection if ever exported
  out = out.replace(/^[=+\-@]/, (c) => `'${c}`);
  if (maxLength && out.length > maxLength) out = out.slice(0, maxLength);
  return out.trim();
}

/** Escape HTML entities for safe plain-text interpolation. */
export function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
