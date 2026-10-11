import type { AIProvider, AIGenerateOptions, AIStreamChunk, AIModelInfo } from '@/types/ai';
import { ProviderError } from '../provider';

const DEFAULT_BASE_URL = 'https://api.openai.com/v1';

export class OpenAIProvider implements AIProvider {
  readonly name = 'openai';

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = DEFAULT_BASE_URL,
  ) {
    if (!apiKey) throw new ProviderError('OpenAI API key missing', 'missing_api_key');
  }

  async generateResponse(options: AIGenerateOptions) {
    const res = await this.request('/chat/completions', {
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
    }, options.signal);

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
      usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
    };

    return {
      content: data.choices[0]?.message?.content ?? '',
      usage: {
        promptTokens: data.usage?.prompt_tokens ?? 0,
        completionTokens: data.usage?.completion_tokens ?? 0,
        totalTokens: data.usage?.total_tokens ?? 0,
      },
    };
  }

  async *streamResponse(options: AIGenerateOptions): AsyncIterable<AIStreamChunk> {
    const res = await this.request('/chat/completions', {
      model: options.model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens,
      stream: true,
      stream_options: { include_usage: true },
    }, options.signal);

    if (!res.body) throw new ProviderError('No response body', 'no_body', res.status, 'openai');

    const reader = res.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let usage: AIStreamChunk['usage'];

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const raw of lines) {
          const line = raw.trim();
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') {
            yield { delta: '', done: true, usage };
            return;
          }
          try {
            const json = JSON.parse(payload) as {
              choices?: Array<{ delta?: { content?: string } }>;
              usage?: { prompt_tokens: number; completion_tokens: number; total_tokens: number };
            };
            const delta = json.choices?.[0]?.delta?.content ?? '';
            if (json.usage) {
              usage = {
                promptTokens: json.usage.prompt_tokens,
                completionTokens: json.usage.completion_tokens,
                totalTokens: json.usage.total_tokens,
              };
            }
            if (delta) yield { delta, done: false };
          } catch {
            /* ignore */
          }
        }
      }
      yield { delta: '', done: true, usage };
    } finally {
      reader.releaseLock();
    }
  }

  async countTokens(text: string): Promise<number> {
    return Math.ceil(text.length / 4);
  }

  async getModelInfo(model: string): Promise<AIModelInfo> {
    return {
      slug: model,
      name: model,
      provider: 'openai',
      contextWindow: 128000,
      supportsStreaming: true,
      supportsVision: true,
    };
  }

  private async request(path: string, body: unknown, signal?: AbortSignal) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(
        `OpenAI request failed: ${res.status} ${text.slice(0, 200)}`,
        'provider_error',
        res.status,
        'openai',
      );
    }
    return res;
  }
}
