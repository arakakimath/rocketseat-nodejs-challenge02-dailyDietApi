import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
import z from 'zod'
import { randomUUID } from 'node:crypto'

import { checkBodyMeals } from '../middlewares/check-body-meals'
import { database } from '../database/database-tools'
import { getId } from '../middlewares/check-id-valid'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    (request, reply) => {
      return database.showAll('meals')
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    (request, reply) => {
      const id = getId(request, reply)

      return database.showOne('meals', id)
    },
  )

  app.post(
    '/',
    {
      preHandler: [checkBodyMeals],
    },
    (request, reply) => {
      const { name, description, date, hour, diet } = request.body

      let { sessionId } = request.cookies

      if (!sessionId) {
        sessionId = randomUUID()

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        })
      }

      database.insert('meals', {
        name,
        description,
        meal_time: dayjs(date)
          .hour(hour.split(':')[0])
          .minute(hour.split(':')[1])
          .format('DD/MM/YY, HH:mm'),
        diet,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    (request, reply) => {
      const id = getId(request, reply)
    },
  )
}
