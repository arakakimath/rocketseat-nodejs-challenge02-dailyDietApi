import { config } from 'dotenv'
import { z } from 'zod'

// process.env
config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0')
})

const _env = envSchema.safeParse(process.env)

if (_env.sucess === false) {
  console.error('⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
