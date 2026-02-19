import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzleNode } from 'drizzle-orm/node-postgres'
import * as schema from '@/db/schema'
import { env } from '@/lib/env'

export const db =
  env.DB_TYPE === 'neon'
    ? drizzleNeon({ client: neon(env.DATABASE_URL), schema })
    : drizzleNode(env.DATABASE_URL, { schema })
