import Mongoose from 'mongoose'

const accountSchema = Mongoose.Schema({
  name: String,
  owner: String,
  balance: Number,
  active: Boolean
})

module.exports = Mongoose.model('Accounts', accountSchema)
