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

  async function createAccount (accountInfo) {
    const { name } = accountInfo

    try {
      const account = await getAllAccountsByQuery({ name })

      if (!account || account.length < 1) {
        return createReturnObject(400, false, `Account ${name} already exist`)
      }

      return createReturnObject(200, true, await Accounts.create(accountInfo))
    } catch (error) {
      const message = `General failure when creating account ${name}`
      return createReturnObject(500, true, message, error)
    }
  }

  async function updateAccountByName (name, accountInfo) {
    try {
      const account = await Accounts.findOneAndUpdate({ name }, accountInfo, { new: true })

      if (!account) {
        return createReturnObject(400, false, `Account ${name} might not exist`)
      }

      return createReturnObject(200, true, account)
    } catch (error) {
      const message = `General failure when updating account ${name}`
      return createReturnObject(500, true, message, error)
    }
  }

  async function deleteAccountByName (name) {
    try {
      const { result } = await Accounts.remove({ name })

      if (!result.n) {
        return createReturnObject(400, false, `Account ${name} does not exist`)
      }

      return createReturnObject(200, true, `Succesfully deleted account ${name}`)
    } catch (error) {
      const message = `General failure when deleting account ${name}`
      return createReturnObject(500, true, message, error)
    }
  }

  return {
    getAllAccounts,
    getAllAccountsByQuery,
    createAccount,
    updateAccountByName,
    deleteAccountByName
  }
}
