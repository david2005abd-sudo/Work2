import { z } from 'zod';
import { LIMITS } from '@/config/constants';
import { usernameSchema } from './common';

export const profileSchema = z.object({
  fullName: z.string().min(2).max(80).trim(),
  username: usernameSchema,
  bio: z.string().max(LIMITS.bioMaxLength).optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const appearanceSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']),
});

export const localeSchema = z.object({
  locale: z.enum(['ar', 'en']),
  timezone: z.string().min(1).max(64),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .max(72)
      .regex(/[A-Za-z]/)
      .regex(/[0-9]/),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'كلمتا المرور غير متطابقتين',
    path: ['confirmPassword'],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
export type AppearanceInput = z.infer<typeof appearanceSchema>;
export type LocaleInput = z.infer<typeof localeSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
