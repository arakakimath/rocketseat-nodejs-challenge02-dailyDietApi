import { FastifyReply, FastifyRequest } from 'fastify'
import z, { ZodError } from 'zod'

export function getId(request: FastifyRequest, reply: FastifyReply) {
  const idSchema = z.object({
    id: z.string().uuid(),
  })

  let id

  try {
    id = idSchema.parse(request.params)
  } catch (err) {
    if (err instanceof ZodError) {
      console.log(JSON.parse(err.message)[0].message)

      return reply.status(400).send({
        message: JSON.parse(err.message)[0].message,
        status: 'error',
      })
    } else {
      throw new Error(err)
    }
  }

  return id
}