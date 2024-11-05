import { config } from 'dotenv'
import { z } from 'zod'

// process.env
config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  DATABASE_URL: z.string().trim().min(1),
  PORT: z.coerce.number().default(3333),
  HOST: z.string().default('0.0.0.0')
})

let _env

try {
  _env = envSchema.parse(process.env)
} catch (err) {
  console.log(err)
  throw new Error('Invalid environmental variables')
}

export const env = _env

