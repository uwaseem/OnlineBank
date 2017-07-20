import Mongoose from 'mongoose'

export default function (app) {
  const Users = Mongoose.model('Users')

  app.get('/users', async (req, res) => {
    try {
      const users = await Users.find()
      res.status(200).json(users)
    } catch (error) {
      console.error('Error while retrieving all users', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.get('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const user = await Users.findOne({ username })

      if (!user) {
        return res.status(404).json({ message: `User ${username} does not exist` })
      }

      res.status(200).json(user)
    } catch (error) {
      console.error(`Error while retrieving user ${username}`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.post('/user', async (req, res) => {
    const userInfo = req.body

    try {
      let user = await Users.findOne({ username: userInfo.username })

      if (user) {
        return res.status(400).json({ message: `Username ${userInfo.username} already exist` })
      }

      user = await Users.create(userInfo)
      res.status(200).json(user)
    } catch (error) {
      console.error('Error while creating user', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.put('/user/username/:username', async (req, res) => {
    const { username } = req.params
    const userInfo = req.body
    userInfo.username = username

    try {
      const user = await Users.findOneAndUpdate({ username }, userInfo, { new: true })

      if (!user) {
        return res.status(400).json({ message: `Failed to update user ${username}` })
      }

      res.status(200).json(user)
    } catch (error) {
      console.error('Error while updating user', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.delete('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const { n: success } = await Users.remove({ username })

      if (!success) {
        return res.status(400).json({ message: `Failed to delete user ${username}` })
      }

      res.sendStatus(200)
    } catch (error) {
      console.error(`Error while deleting user ${username}`, error)
      res.status(500).json({ message: error.message })
    }
  })
}
