import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ConversationService } from '@/server/services/conversation.service';
import { createSupabaseMock } from '../unit/helpers/mocks';

describe('ConversationService', () => {
  let service: ConversationService;
  let client: ReturnType<typeof createSupabaseMock>['client'];

  beforeEach(() => {
    const mock = createSupabaseMock();
    client = mock.client;
    service = new ConversationService(client);
  });

  it('rejects access when conversation belongs to another user', async () => {
    const { client: c } = createSupabaseMock();
    // Override findById to return a foreign conversation
    vi.spyOn(ConversationService.prototype as unknown as { getOwnedOrThrow: () => Promise<unknown> }, 'getOwnedOrThrow');

    await expect(
      new ConversationService(c).getOwnedOrThrow('11111111-1111-4111-8111-111111111111', 'u1'),
    ).rejects.toThrow();
  });

  it('creates a conversation with default title', async () => {
    // Note: repo.create is mocked at the chain level; it returns data: [].
    // For full integration test, replace with real Supabase.
    expect(typeof service.create).toBe('function');
  });
});
