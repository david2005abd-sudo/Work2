import { z } from 'zod';
import { LIMITS } from '@/config/constants';
import { uuidSchema } from './common';

export const sendMessageSchema = z.object({
  conversationId: uuidSchema.optional(),
  model: z.string().min(1).max(80),
  content: z
    .string()
    .min(1, 'الرسالة فارغة')
    .max(LIMITS.messageMaxLength, 'الرسالة طويلة جدًا')
    .transform((v) => v.trim()),
  clientMessageId: z.string().min(1).max(64).optional(),
  systemPrompt: z.string().max(4000).optional(),
});

export const createConversationSchema = z.object({
  title: z.string().min(1).max(LIMITS.conversationTitleMaxLength).optional(),
  model: z.string().min(1).max(80),
  systemPrompt: z.string().max(4000).optional(),
});

export const updateConversationSchema = z.object({
  title: z.string().min(1).max(LIMITS.conversationTitleMaxLength).optional(),
  isArchived: z.boolean().optional(),
  isFavorite: z.boolean().optional(),
  systemPrompt: z.string().max(4000).nullable().optional(),
});

export const searchSchema = z.object({
  q: z.string().min(1).max(200),
  model: z.string().optional(),
  archived: z.coerce.boolean().optional(),
  favorite: z.coerce.boolean().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateConversationInput = z.infer<typeof createConversationSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
