import Mongoose from 'mongoose'

const userSchema = Mongoose.Schema({
  username: { type: String, lowercase: true, required: true },
  firstName: { type: String },
  lastName: { type: String }
}, { strict: true })

module.exports = Mongoose.model('Users', userSchema)
