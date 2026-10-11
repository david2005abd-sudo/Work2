import { z } from 'zod';

export const uuidSchema = z.string().uuid('معرّف غير صالح');

export const emailSchema = z
  .string()
  .min(3, 'البريد الإلكتروني مطلوب')
  .max(254)
  .email('بريد إلكتروني غير صالح')
  .transform((v) => v.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
  .max(72, 'كلمة المرور طويلة جدًا')
  .regex(/[A-Za-z]/, 'يجب أن تحتوي على حرف واحد على الأقل')
  .regex(/[0-9]/, 'يجب أن تحتوي على رقم واحد على الأقل');

export const usernameSchema = z
  .string()
  .min(3, 'اسم المستخدم قصير جدًا')
  .max(32, 'اسم المستخدم طويل جدًا')
  .transform((v) => v.toLowerCase())
  .pipe(z.string().regex(/^[a-z0-9_]+$/, 'فقط أحرف إنجليزية صغيرة، أرقام، وشرطة سفلية'));

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export const idParamSchema = z.object({ id: uuidSchema });
