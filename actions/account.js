import Mongoose from 'mongoose'

import {
  createReturnObject
} from '../utils'

export default function () {
  const Accounts = Mongoose.model('Accounts')

  async function getAllAccounts () {
    return createReturnObject(200, true, await Accounts.find())
  }

  return {
    getAllAccounts
  }
}
