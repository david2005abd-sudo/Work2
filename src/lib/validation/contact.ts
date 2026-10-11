import { z } from 'zod';
import { emailSchema } from './common';

export const contactSchema = z.object({
  name: z.string().min(2).max(80).trim(),
  email: emailSchema,
  subject: z.string().min(3).max(120).trim(),
  message: z.string().min(10).max(5000).trim(),
});

export type ContactInput = z.infer<typeof contactSchema>;
