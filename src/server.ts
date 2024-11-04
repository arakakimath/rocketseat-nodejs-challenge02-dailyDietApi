import { app } from './app'

app.get('/', () => {
  return 'Hello World!'
})
app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then((err) => {
    console.log(err)
  })
