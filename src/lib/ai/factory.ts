import type { AIProvider } from '@/types/ai';
import { ProviderError, type ProviderName } from './provider';
import { DeepSeekProvider } from './adapters/deepseek';
import { OpenAIProvider } from './adapters/openai';
import { GeminiProvider } from './adapters/gemini';

const registry = new Map<string, AIProvider>();
let _cache: Map<string, AIProvider> | null = null;

function readKey(name: ProviderName): string | undefined {
  switch (name) {
    case 'deepseek':
      return process.env.DEEPSEEK_API_KEY;
    case 'openai':
      return process.env.OPENAI_API_KEY;
    case 'gemini':
      return process.env.GEMINI_API_KEY;
  }
}

/** Resolves a provider instance from a model slug. */
export function getProviderForModel(modelSlug: string): AIProvider {
  const provider = inferProviderFromSlug(modelSlug);
  return getProvider(provider);
}

/** Explicit provider resolution. */
export function getProvider(name: ProviderName): AIProvider {
  if (_cache?.has(name)) return _cache.get(name)!;
  const key = readKey(name);
  if (!key) {
    throw new ProviderError(
      `Provider "${name}" is not configured (missing API key)`,
      'provider_not_configured',
      undefined,
      name,
    );
  }
  let instance: AIProvider;
  switch (name) {
    case 'deepseek':
      instance = new DeepSeekProvider(key);
      break;
    case 'openai':
      instance = new OpenAIProvider(key);
      break;
    case 'gemini':
      instance = new GeminiProvider(key);
      break;
  }
  _cache = _cache ?? new Map();
  _cache.set(name, instance);
  registry.set(name, instance);
  return instance;
}

/** Best-effort provider inference from a model slug. */
export function inferProviderFromSlug(slug: string): ProviderName {
  const s = slug.toLowerCase();
  if (s.startsWith('deepseek')) return 'deepseek';
  if (s.startsWith('gpt') || s.startsWith('o1') || s.startsWith('o3')) return 'openai';
  if (s.startsWith('gemini')) return 'gemini';
  // Fallback to configured default
  const fallback = (process.env.AI_DEFAULT_PROVIDER as ProviderName) ?? 'deepseek';
  return fallback;
}
