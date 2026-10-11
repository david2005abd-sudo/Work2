import type { AIProvider, AIGenerateOptions, AIStreamChunk, AIModelInfo } from '@/types/ai';
import { ProviderError } from '../provider';

const DEFAULT_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

type GeminiContent = {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
};

export class GeminiProvider implements AIProvider {
  readonly name = 'gemini';

  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string = DEFAULT_BASE_URL,
  ) {
    if (!apiKey) throw new ProviderError('Gemini API key missing', 'missing_api_key');
  }

  async generateResponse(options: AIGenerateOptions) {
    const { contents, systemInstruction } = this.mapMessages(options.messages);
    const res = await this.request(`/models/${options.model}:generateContent`, {
      contents,
      systemInstruction,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxTokens,
      },
    }, options.signal);

    const data = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
      usageMetadata?: {
        promptTokenCount?: number;
        candidatesTokenCount?: number;
        totalTokenCount?: number;
      };
    };

    const content = data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
    return {
      content,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount ?? 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount ?? 0,
        totalTokens: data.usageMetadata?.totalTokenCount ?? 0,
      },
    };
  }

  async *streamResponse(options: AIGenerateOptions): AsyncIterable<AIStreamChunk> {
    const { contents, systemInstruction } = this.mapMessages(options.messages);
    const url = `${this.baseUrl}/models/${options.model}:streamGenerateContent?alt=sse&key=${this.apiKey}`;

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens,
        },
      }),
      signal: options.signal,
    });

    if (!res.ok || !res.body) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(
        `Gemini request failed: ${res.status} ${text.slice(0, 200)}`,
        'provider_error',
        res.status,
        'gemini',
      );
    }

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
          if (!payload) continue;
          try {
            const json = JSON.parse(payload) as {
              candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
              usageMetadata?: {
                promptTokenCount?: number;
                candidatesTokenCount?: number;
                totalTokenCount?: number;
              };
            };
            const delta =
              json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
            if (json.usageMetadata) {
              usage = {
                promptTokens: json.usageMetadata.promptTokenCount ?? 0,
                completionTokens: json.usageMetadata.candidatesTokenCount ?? 0,
                totalTokens: json.usageMetadata.totalTokenCount ?? 0,
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
      provider: 'gemini',
      contextWindow: 1_000_000,
      supportsStreaming: true,
      supportsVision: true,
    };
  }

  private mapMessages(messages: AIGenerateOptions['messages']) {
    const contents: GeminiContent[] = [];
    let systemInstruction: { parts: Array<{ text: string }> } | undefined;

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = { parts: [{ text: msg.content }] };
        continue;
      }
      contents.push({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      });
    }
    return { contents, systemInstruction };
  }

  private async request(path: string, body: unknown, signal?: AbortSignal) {
    const url = `${this.baseUrl}${path}?key=${this.apiKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new ProviderError(
        `Gemini request failed: ${res.status} ${text.slice(0, 200)}`,
        'provider_error',
        res.status,
        'gemini',
      );
    }
    return res;
  }
}
