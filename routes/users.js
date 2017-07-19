import Mongoose from 'mongoose'

export default function (app) {
  const Users = Mongoose.model('Users')

  app.get('/users', async (req, res) => {
    try {
      const users = await Users.find()
      if (users.length < 1) {
        res.status(204)
      }

      res.status(200).send(users)
    } catch (error) {
      console.error('Error while retrieving all users', error)
      res.sendStatus(500)
    }
  })

  app.get('/user/name/:name', async (req, res) => {
    const { name } = req.params

    try {
      const user = await Users.findOne({ name })

      if (!user) {
        res.status(204)
      }

      res.status(200).send(user)
    } catch (error) {
      console.error('Error while retrieving user', error)
      res.sendStatus(500)
    }
  })
}
