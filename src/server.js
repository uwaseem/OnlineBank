import Express from 'express'

// import * as Configurator from './config'

export default async function () {
  const app = Express()

  app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }))

  app.all('*', (req, res) => res.sendStatus(404))

  const server = app.listen(process.env.port || 3000)

  // process.on('unhandledRejection', (reason, p) => {
  //   console.error('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // })

  return { server }
}
