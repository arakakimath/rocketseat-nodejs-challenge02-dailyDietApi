import fastify from 'fastify'

import { mealsRoutes } from './routes/meals-routes'

export const app = fastify()

app.register(mealsRoutes, {
  prefix: 'meals'
})