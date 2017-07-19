import Mongoose from 'mongoose'

export default function (app) {
  const Users = Mongoose.model('Users')

  app.get('/users', async (req, res) => {
    try {
      const users = await Users.find()
      res.status(200).json(users)
    } catch (error) {
      console.error('Error while retrieving all users', error)
      res.sendStatus(500)
    }
  })

  app.get('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const user = await Users.findOne({ username })
      res.status(200).json(user)
    } catch (error) {
      console.error(`Error while retrieving user ${username}`, error)
      res.sendStatus(500)
    }
  })

  app.post('/user', async(req, res) => {
    const userInfo = req.body

    try {
      let user = await Users.findOne({ username: userInfo.username })

      if (user) {
        return res.status(400).json({ message: 'username already exist' })
      }

      user = await Users.create(userInfo)
      res.status(200).json(user)
    } catch (error) {
      console.error('Error while creating user', error)
      res.sendStatus(500)
    }
  })

  app.delete('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const { result } = await Users.remove({ username })
      res.status(200).json(result)
    } catch (error) {
      console.error(`Error while deleting user ${username}`, error)
      res.sendStatus(500)
    }
  })
}
