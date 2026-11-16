import { z } from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  CORS_ORIGINS: z.string().default('http://localhost:3000,http://localhost:8081'),
  DATABASE_URL: z
    .string()
    .default('postgresql://postgres:postgres@localhost:5432/majuligo'),
  JWT_SECRET: z
    .string()
    .min(16, 'JWT secret must be at least 16 characters for security')
    .default('dev-insecure-jwt-secret-majuligo-phase-1'),
  OTP_PROVIDER: z.enum(['mock', 'sms']).default('mock'),
  OTP_DEFAULT_DEV_CODE: z.string().default('123456'),
});

export type Config = z.infer<typeof EnvSchema>;

export function loadConfig(): Config {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('❌ Invalid Environment Variables:', parsed.error.format());
    throw new Error('Invalid environment configuration');
  }
  return parsed.data;
}

export const config = loadConfig();
