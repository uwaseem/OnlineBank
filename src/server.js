import BodyParser from 'body-parser'
import Express from 'express'

import routesAccount from '../routes/account'

export default async function () {
  const app = Express()

  app.use(BodyParser.json())

  routesAccount(app)
  app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }))
  app.all('*', (req, res) => res.sendStatus(404))

  const server = app.listen(process.env.port || 3000)

  return { server }
}
