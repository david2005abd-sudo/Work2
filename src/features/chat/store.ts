'use client';

import { create } from 'zustand';
import type { AIMessage, AIStreamChunk } from '@/types/ai';

export type LocalMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  status: 'pending' | 'streaming' | 'complete' | 'failed';
  createdAt: string;
  clientId?: string;
};

type ChatState = {
  messages: LocalMessage[];
  streaming: boolean;
  abortController: AbortController | null;
  activeConversationId: string | null;
  setActiveConversation: (id: string | null) => void;
  setMessages: (msgs: LocalMessage[]) => void;
  appendMessage: (msg: LocalMessage) => void;
  updateMessage: (id: string, patch: Partial<LocalMessage>) => void;
  appendDelta: (id: string, delta: string) => void;
  setStreaming: (v: boolean) => void;
  setAbortController: (ac: AbortController | null) => void;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  streaming: false,
  abortController: null,
  activeConversationId: null,
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setMessages: (msgs) => set({ messages: msgs }),
  appendMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  updateMessage: (id, patch) =>
    set((s) => ({ messages: s.messages.map((m) => (m.id === id ? { ...m, ...patch } : m)) })),
  appendDelta: (id, delta) =>
    set((s) => ({
      messages: s.messages.map((m) => (m.id === id ? { ...m, content: m.content + delta } : m)),
    })),
  setStreaming: (v) => set({ streaming: v }),
  setAbortController: (ac) => set({ abortController: ac }),
  reset: () => set({ messages: [], streaming: false, abortController: null, activeConversationId: null }),
}));

export type { AIMessage, AIStreamChunk };
