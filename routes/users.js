import UserActions from '../actions/user'

export default function (app) {
  const User = UserActions()

  app.get('/users', async (req, res) => {
    try {
      const users = await User.getAllUsers()
      res.status(users.code).json({ message: users.message })
    } catch (error) {
      console.error('Error while retrieving all users', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.get('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const user = await User.getUserByUsername(username)
      res.status(user.code).json({ message: user.message })
    } catch (error) {
      console.error(`Error while retrieving user ${username}`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.post('/user', async (req, res) => {
    const userInfo = req.body

    try {
      const user = await User.createUser(userInfo)
      res.status(user.code).json({ message: user.message })
    } catch (error) {
      console.error('Error while creating user', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.put('/user/username/:username', async (req, res) => {
    const { username } = req.params
    const userInfo = req.body

    try {
      const user = await User.updateUserByUsername(username, userInfo)
      res.status(user.code).json({ message: user.message })
    } catch (error) {
      console.error('Error while updating user', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.delete('/user/username/:username', async (req, res) => {
    const { username } = req.params

    try {
      const result = await User.deleteUserByUsername(username)
      res.status(200).json({ message: result.message })
    } catch (error) {
      console.error(`Error while deleting user ${username}`, error)
      res.status(500).json({ message: error.message })
    }
  })
}
