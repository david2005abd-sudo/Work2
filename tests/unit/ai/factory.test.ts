import { describe, it, expect, beforeEach, vi } from 'vitest';
import { inferProviderFromSlug, getProvider, getProviderForModel } from '@/lib/ai/factory';
import { ProviderError } from '@/lib/ai/provider';

describe('inferProviderFromSlug', () => {
  it('infers deepseek', () => {
    expect(inferProviderFromSlug('deepseek-chat')).toBe('deepseek');
    expect(inferProviderFromSlug('deepseek-reasoner')).toBe('deepseek');
  });
  it('infers openai', () => {
    expect(inferProviderFromSlug('gpt-4o-mini')).toBe('openai');
    expect(inferProviderFromSlug('o1-preview')).toBe('openai');
  });
  it('infers gemini', () => {
    expect(inferProviderFromSlug('gemini-1.5-flash')).toBe('gemini');
  });
  it('falls back to default provider', () => {
    vi.stubEnv('AI_DEFAULT_PROVIDER', 'deepseek');
    expect(inferProviderFromSlug('unknown-model')).toBe('deepseek');
    vi.unstubAllEnvs();
  });
});

describe('getProvider', () => {
  beforeEach(() => {
    vi.stubEnv('DEEPSEEK_API_KEY', '');
    vi.stubEnv('OPENAI_API_KEY', '');
    vi.stubEnv('GEMINI_API_KEY', '');
  });

  it('throws if api key missing', () => {
    expect(() => getProvider('deepseek')).toThrow(ProviderError);
  });

  it('creates provider when key present', () => {
    vi.stubEnv('DEEPSEEK_API_KEY', 'test-key');
    const p = getProvider('deepseek');
    expect(p.name).toBe('deepseek');
  });
});
