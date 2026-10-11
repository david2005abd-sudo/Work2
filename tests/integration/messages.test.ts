import { describe, it, expect } from 'vitest';
import { sendMessageSchema } from '@/lib/validation/chat';

describe('Message flow (schema validation)', () => {
  it('rejects message with no model', () => {
    const r = sendMessageSchema.safeParse({ content: 'hi' });
    expect(r.success).toBe(false);
  });

  it('rejects empty content', () => {
    const r = sendMessageSchema.safeParse({ model: 'deepseek-chat', content: '' });
    expect(r.success).toBe(false);
  });

  it('accepts valid message with clientMessageId', () => {
    const r = sendMessageSchema.safeParse({
      model: 'deepseek-chat',
      content: 'مرحبا',
      clientMessageId: 'abc-123',
    });
    expect(r.success).toBe(true);
  });
});
