import Mongoose from 'mongoose'

import {
  createReturnObject
} from '../utils'

export default function () {
  const Accounts = Mongoose.model('Accounts')

  async function getAllAccounts () {
    return createReturnObject(200, true, await Accounts.find())
  }

  async function getAllAccountsByQuery (query) {
    const queryKeys = Object.keys(query)

    try {
      const accounts = await Accounts.find(query)

      if (!accounts || accounts.length < 1) {
        return createReturnObject(400, false, `No accounts exist matching the ${queryKeys} provided`)
      }

      return createReturnObject(200, true, accounts)
    } catch (error) {
      const message = `General failure when getting accounts based on the query ${queryKeys} provided`
      return createReturnObject(500, true, message, error)
    }
  }

  return {
    getAllAccounts,
    getAllAccountsByQuery
  }
}
