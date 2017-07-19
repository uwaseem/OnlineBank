import Mongoose from 'mongoose'

const userSchema = Mongoose.Schema({
  name: String
})

module.exports = Mongoose.model('Users', userSchema)
