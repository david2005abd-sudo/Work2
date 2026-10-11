export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
}

export interface AIUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface AIGenerateOptions {
  model: string;
  messages: AIMessage[];
  temperature?: number;
  maxTokens?: number;
  signal?: AbortSignal;
}

export interface AIStreamChunk {
  delta: string;
  done: boolean;
  usage?: AIUsage;
}

export interface AIModelInfo {
  slug: string;
  name: string;
  provider: string;
  contextWindow: number;
  supportsStreaming: boolean;
  supportsVision: boolean;
}

export interface AIProvider {
  readonly name: string;
  generateResponse(options: AIGenerateOptions): Promise<{ content: string; usage: AIUsage }>;
  streamResponse(options: AIGenerateOptions): AsyncIterable<AIStreamChunk>;
  countTokens(text: string, model?: string): Promise<number>;
  getModelInfo(model: string): Promise<AIModelInfo>;
}
