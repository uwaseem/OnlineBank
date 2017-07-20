import Mongoose from 'mongoose'

const accountSchema = Mongoose.Schema({
  name: { type: String, required: true },
  user: { type: String, lowercase: true, required: true },
  balance: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['open', 'close'], default: 'open' }
}, { strict: true })

module.exports = Mongoose.model('Accounts', accountSchema)
