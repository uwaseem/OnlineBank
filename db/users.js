import Mongoose from 'mongoose'

const userSchema = Mongoose.Schema({
  username: String,
  firstName: String,
  lastName: String
})

module.exports = Mongoose.model('Users', userSchema)
