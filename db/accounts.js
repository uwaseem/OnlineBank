import Mongoose from 'mongoose'

const accountSchema = Mongoose.Schema({
  name: String,
  owner: String,
  balance: Number,
  status: String
})

module.exports = Mongoose.model('Accounts', accountSchema)
