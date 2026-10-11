import { z } from 'zod';

/**
 * Server + client environment validation.
 * Public vars are validated eagerly; secrets are validated lazily
 * on the server to allow builds without secrets (CI typecheck).
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_SITE_NAME: z.string().default('Nados AI'),
  NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
  NEXT_PUBLIC_ENABLE_WEB_SEARCH: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
});

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20),
  DEEPSEEK_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  AI_DEFAULT_PROVIDER: z.enum(['deepseek', 'openai', 'gemini']).default('deepseek'),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default('Nados AI <no-reply@nados.ai>'),
  SENTRY_DSN: z.string().url().optional(),
});

function parsePublic() {
  const result = publicSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
    NEXT_PUBLIC_ENABLE_GOOGLE_AUTH: process.env.NEXT_PUBLIC_ENABLE_GOOGLE_AUTH,
    NEXT_PUBLIC_ENABLE_WEB_SEARCH: process.env.NEXT_PUBLIC_ENABLE_WEB_SEARCH,
  });
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid public environment variables:\n${issues}`);
  }
  return result.data;
}

let _publicEnv: z.infer<typeof publicSchema> | null = null;
export function publicEnv() {
  if (_publicEnv) return _publicEnv;
  _publicEnv = parsePublic();
  return _publicEnv;
}

let _serverEnv: z.infer<typeof serverSchema> | null = null;
export function serverEnv() {
  if (typeof window !== 'undefined') {
    throw new Error('serverEnv() must not be called on the client');
  }
  if (_serverEnv) return _serverEnv;
  const result = serverSchema.safeParse(process.env);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  • ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Invalid server environment variables:\n${issues}`);
  }
  _serverEnv = result.data;
  return _serverEnv;
}

export const env = {
  get public() {
    return publicEnv();
  },
  get server() {
    return serverEnv();
  },
};
