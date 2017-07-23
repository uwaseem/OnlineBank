import Mongoose from 'mongoose'

import {
  createReturnObject
} from '../utils'

export default function () {
  const Users = Mongoose.model('Users')

  async function getAllUsers () {
    return createReturnObject(200, true, await Users.find())
  }

  async function getUserByUsername (username) {
    try {
      const user = await Users.findOne({ username })

      if (!user) {
        return createReturnObject(400, false, `User ${username} does not exist`)
      }

      return createReturnObject(200, true, user)
    } catch (error) {
      const message = `General failure when getting information for user ${username}`
      return createReturnObject(500, true, message, error)
    }
  }

  async function createUser (userInfo) {
    const { username } = userInfo

    try {
      const user = await getUserByUsername(username)

      if (user) {
        return createReturnObject(400, false, `Username ${username} already exist`)
      }

      return createReturnObject(200, true, await Users.create(userInfo))
    } catch (error) {
      const message = `General failure when creating user ${username}`
      return createReturnObject(500, true, message, error)
    }
  }

  async function deleteUserByUsername (username) {
    try {
      const { result } = await Users.remove({ username })

      if (!result.n) {
        return createReturnObject(400, false, `User ${username} does not exist`)
      }

      return createReturnObject(200, true, `Succesfully deleted username ${username}`)
    } catch (error) {
      const message = `General failure when deleting user ${username}`
      return createReturnObject(500, true, message, error)
    }
  }

  async function updateUserByUsername (username, userInfo) {
    if (username !== userInfo.username) {
      return createReturnObject(400, false, 'Cannot update username')
    }

    try {
      const user = await Users.findOneAndUpdate({ username }, userInfo, { new: true })

      if (!user) {
        return createReturnObject(400, false, `Failed to update user ${username}`)
      }

      return createReturnObject(200, true, user)
    } catch (error) {
      const message = `General failure when updating user ${username}`
      return createReturnObject(500, true, message, error)
    }
  }

  return {
    getAllUsers,
    getUserByUsername,
    createUser,
    deleteUserByUsername,
    updateUserByUsername
  }
}
