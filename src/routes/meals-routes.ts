import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
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
      const { sessionId } = request.cookies

      return database.showAll('meals', sessionId)
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    (request, reply) => {
      const id = getId(request, reply)
      const { sessionId } = request.cookies

      return database.showOne('meals', { id, sessionId })
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
          .format('DD/MM/YYYY, HH:mm'),
        diet,
        session_id: sessionId,
      })

      return reply.status(201).send()
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists, checkBodyMeals],
    },
    (request, reply) => {
      const id = getId(request, reply)
      const { sessionId } = request.cookies
      const { name, description, date, hour, diet } = request.body

      database.edit('meals', {
        id,
        name,
        description,
        meal_time: dayjs(date)
          .hour(hour.split(':')[0])
          .minute(hour.split(':')[1])
          .format('DD/MM/YYYY, HH:mm'),
        diet,
        sessionId,
      })

      return reply.status(200).send()
    },
  )

  app.delete(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    (request, reply) => {
      const id = getId(request, reply)
      const { sessionId } = request.cookies

      database.remove('meals', { id, sessionId })

      return reply.status(200).send()
    },
  )
}
