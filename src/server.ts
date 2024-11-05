import { app } from './app'
import { env } from './env'
import dayjs from 'dayjs'

app
  .listen({
    port: env.PORT,
    host: env.HOST,
  })
  .then((address) => {
    console.log(
      `HTTP Server listening at ${address.replace('[::1]', 'localhost')}`,
    )
  })