import { FastifyInstance } from 'fastify'
import { checkBodyMeals } from '../middlewares/check-body-meals'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', (request, reply) => 'Hello wworld')

  app.post(
    '/',
    {
      preHandler: [checkBodyMeals],
    },
    (request, reply) => {
      return reply.status(201).send()
    },
  )
}
