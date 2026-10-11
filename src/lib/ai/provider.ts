import type {
  AIProvider,
  AIGenerateOptions,
  AIStreamChunk,
  AIUsage,
  AIModelInfo,
} from '@/types/ai';

export type { AIProvider, AIGenerateOptions, AIStreamChunk, AIUsage, AIModelInfo };

/**
 * Registry of available providers.
 * Adding a new provider is: implement the interface + register it here.
 */
export type ProviderName = 'deepseek' | 'openai' | 'gemini';

export interface ProviderFactoryConfig {
  name: ProviderName;
  apiKey: string;
  baseUrl?: string;
}

export class ProviderError extends Error {
  constructor(
    message: string,
    readonly code: string,
    readonly status?: number,
    readonly provider?: ProviderName,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}
