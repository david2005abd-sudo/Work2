import { describe, it, expect } from 'vitest';
import { sendMessageSchema, updateConversationSchema, searchSchema } from '@/lib/validation/chat';
import { LIMITS } from '@/config/constants';

const validUuid = '11111111-1111-4111-8111-111111111111';

describe('sendMessageSchema', () => {
  it('accepts minimal input', () => {
    const r = sendMessageSchema.safeParse({ model: 'deepseek-chat', content: 'مرحبا' });
    expect(r.success).toBe(true);
  });

  it('trims content', () => {
    const r = sendMessageSchema.parse({ model: 'x', content: '  hi  ' });
    expect(r.content).toBe('hi');
  });

  it('rejects empty content', () => {
    const r = sendMessageSchema.safeParse({ model: 'x', content: '   ' });
    expect(r.success).toBe(false);
  });

  it('rejects content exceeding max length', () => {
    const r = sendMessageSchema.safeParse({
      model: 'x',
      content: 'a'.repeat(LIMITS.messageMaxLength + 1),
    });
    expect(r.success).toBe(false);
  });
});

describe('updateConversationSchema', () => {
  it('rejects empty title', () => {
    expect(updateConversationSchema.safeParse({ title: '' }).success).toBe(false);
  });

  it('accepts toggles', () => {
    expect(
      updateConversationSchema.safeParse({ isArchived: true, isFavorite: false }).success,
    ).toBe(true);
  });
});

describe('searchSchema', () => {
  it('coerces numeric page', () => {
    const r = searchSchema.parse({ q: 'test', page: '2', pageSize: '10' });
    expect(r.page).toBe(2);
    expect(r.pageSize).toBe(10);
  });
});
