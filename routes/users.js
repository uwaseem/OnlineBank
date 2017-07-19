import Mongoose from 'mongoose'

export default function (app) {
  const Users = Mongoose.model('Users')

  app.get('/users', (req, res) => {
    Users.findOne({ name: 'waseem' }, (error, response) => {
      if (error) {
        console.error('Error while retrieving user', error)
        res.status(500)
      }

      res.status(200).json(response)
    })
  })
}
