import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'

import { checkBodyMeals } from '../middlewares/check-body-meals'
import { database } from '../database/database-tools'

export async function mealsRoutes(app: FastifyInstance) {
  app.get('/', (request, reply) => {
    return database.showAll('meals')
  })

  app.post(
    '/',
    {
      preHandler: [checkBodyMeals],
    },
    (request, reply) => {
      const { name, description, date, hour, diet } = request.body

      database.insert('meals', {
        name,
        description,
        meal_time: dayjs(date)
          .hour(hour.split(':')[0])
          .minute(hour.split(':')[1])
          .format('DD/MM/YY, HH:mm'),
        diet,
      })

      return reply.status(201).send()
    },
  )
}
