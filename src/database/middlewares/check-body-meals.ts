import { FastifyReply, FastifyRequest } from 'fastify'
import z from 'zod'

export async function checkBodyMeals(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const bodySchema = z.object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().optional(),
    date: z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value), {
      message: 'Date must be in YYYY-MM-DD format',
    }),
    hour: z.string().refine((value) => /^\d{2}:\d{2}$/.test(value), {
      message: 'Hour must be in HH:mm format',
    }),
    diet: z.boolean(),
  })

  try {
    bodySchema.parse(request.body)
  } catch (err) {
    return reply.status(400).send({
      error: err
    })
  }
}