import Mongoose from 'mongoose'

const accountSchema = Mongoose.Schema({
  name: String,
  owner: String,
  balance: Number,
  status: String
}, { strict: true })

module.exports = Mongoose.model('Accounts', accountSchema)
