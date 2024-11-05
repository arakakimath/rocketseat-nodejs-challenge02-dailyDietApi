import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'

import { checkBodyMeals } from '../middlewares/check-body-meals'
import { database } from '../database/database-tools'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', (request, reply) => 'Hello wworld')

  app.post(
    '/',
    {
      preHandler: [checkBodyMeals],
    },
    (request, reply) => {
      const { name, description, date, hour, diet } = request.body

      database.insert('meals',{
        name,
        description,
        meal_time: dayjs().day(date).hour(hour),
        diet,
        created_at: dayjs(),
        updated_at: dayjs(),
      })

      return reply.status(201).send()
    },
  )
}
