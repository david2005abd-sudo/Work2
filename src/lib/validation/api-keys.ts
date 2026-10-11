import { z } from 'zod';

export const createApiKeySchema = z.object({
  name: z.string().min(2).max(60).trim(),
  scopes: z
    .array(z.enum(['chat:read', 'chat:write', 'conversations:read', 'conversations:write']))
    .min(1)
    .default(['chat:read']),
  expiresInDays: z.coerce.number().int().min(1).max(365).optional(),
});

export type CreateApiKeyInput = z.infer<typeof createApiKeySchema>;
