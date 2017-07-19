import Mongoose from 'mongoose'

import './users'

export default async function () {
  const databaseUri = `mongodb://localhost/bank`

  Mongoose.Promise = global.Promise
  const mongoDb = Mongoose.connect(databaseUri, { useMongoClient: true })
    .then(() => console.info(`Database connected at ${databaseUri}`))
    .catch(error => console.error(`Database connection error: ${error.message}`))

  process.on('SIGINT', () => {
    Mongoose.connection.close(() => {
      console.warn('MongoDb connection disconnected through app termination')
      process.exit(0)
    })
  })

  return { mongoDb }
}
