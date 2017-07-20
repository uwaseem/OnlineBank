import Mongoose from 'mongoose'

export default function (app) {
  const Accounts = Mongoose.model('Accounts')

  app.get('/accounts', async (req, res) => {
    try {
      const accounts = await Accounts.find()
      res.status(200).json(accounts)
    } catch (error) {
      console.error('Error while retrieving all accounts', error)
      res.status(500).json({ message: error.message })
    }
  })

  app.get('/accounts/user/:user', async (req, res) => {
    const { user } = req.params

    try {
      const account = await Accounts.find({ user })

      if (!account) {
        return res.status(404).json({ message: `User ${user} does not have any accounts` })
      }

      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while retrieving account for user ${user}`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.get('/accounts/status/:status', async (req, res) => {
    const { status } = req.params

    // TODO: Use the enum instead later
    if (status !== 'open' && status !== 'close') {
      return res.status(404).json({ message: `${status} is an invalid account status` })
    }

    try {
      const account = await Accounts.find({ status })

      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while retrieving all account with ${status} status`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.post('/account', async(req, res) => {
    const accountInfo = req.body

    try {
      let account = await Accounts.findOne({ name: accountInfo.name })

      if (account) {
        return res.status(400).json({ message: `Account ${accountInfo.name} already exist` })
      }

      account = await Accounts.create(accountInfo)
      res.status(200).json(account)
    } catch (error) {
      console.error('Error while creating account', error)
      res.status(500).json({ message: error.message })
    }
  })

  // Let's not allow user to update account
  // We should rethink this approach
  /* app.put('/account/name/:name', async (req, res) => {
    const { name } = req.params
    const accountInfo = req.body
    accountInfo.name = name

    try {
      const account = await Accounts.findOneAndUpdate({ name }, accountInfo, { new: true })

      if (!account) {
        return res.status(400).json({ message: `Account ${name} does not exist to be updated` })
      }

      res.status(200).json(account)
    } catch (error) {
      console.error('Error while updating account', error)
      res.status(500).json({ message: error.message })
    }
  }) */

  app.patch('/account/name/:name/:status', async (req, res) => {
    const { name, status } = req.params

    // TODO: Use the enum instead later
    if (status !== 'open' && status !== 'close') {
      return res.status(404).json({ message: `${status} is an invalid account status` })
    }

    try {
      const account = await Accounts.findOneAndUpdate({ name }, { status }, { new: true })

      if (!account) {
        return res.status(400).json({ message: `Failed to ${status} account ${name}` })
      }

      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while attempting to ${status} account`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.delete('/account/name/:name', async (req, res) => {
    const { name } = req.params

    try {
      const { result } = await Accounts.remove({ name })

      if (!result.n) {
        return res.status(400).json({ message: `Failed to delete account ${name}` })
      }

      res.sendStatus(200)
    } catch (error) {
      console.error(`Error while deleting account ${name}`, error)
      res.status(500).json({ message: error.message })
    }
  })
}
