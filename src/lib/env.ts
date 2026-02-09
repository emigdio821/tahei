import { config } from 'dotenv'
import { z } from 'zod'

config({ path: ['.env.local', '.env'], quiet: true })

const envSchema = z.object({
  BETTER_AUTH_SECRET: z.string().min(1, 'BETTER_AUTH_SECRET is required'),
  BETTER_AUTH_URL: z.string().min(1, 'BETTER_AUTH_URL is required'),
  DATABASE_URL: z.url().min(1, 'DATABASE_URL is required'),
  DB_TYPE: z.enum(['local', 'neon']).default('local'),
})

export const env = envSchema.parse(process.env)
