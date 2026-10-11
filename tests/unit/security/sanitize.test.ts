import { describe, it, expect } from 'vitest';
import { sanitizeText, escapeHtml } from '@/lib/security/sanitize';

describe('sanitizeText', () => {
  it('strips control chars', () => {
    expect(sanitizeText('a\u0000b\u0007c')).toBe('abc');
  });
  it('truncates to max length', () => {
    expect(sanitizeText('abcdef', 3)).toBe('abc');
  });
  it('neutralizes formula prefixes', () => {
    expect(sanitizeText('=SUM(A1)')).toBe("'=SUM(A1)");
  });
});

describe('escapeHtml', () => {
  it('escapes script-breaking chars', () => {
    expect(escapeHtml('<script>alert("x")</script>')).toBe(
      '&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;',
    );
  });
});
