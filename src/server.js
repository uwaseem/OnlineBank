import BodyParser from 'body-parser'
import Express from 'express'

import mongoDB from '../db'
import routesAccount from '../routes/accounts'
import routesBalances from '../routes/balances'
import routesUsers from '../routes/users'

export default async function () {
  mongoDB()

  const app = Express()
  app.use(BodyParser.json())

  routesAccount(app)
  routesBalances(app)
  routesUsers(app)

  app.get('/ping', (req, res) => res.status(200).json({ message: 'pong' }))
  app.all('*', (req, res) => res.sendStatus(404))

  const server = app.listen(process.env.port || 3000)

  return { server }
}
