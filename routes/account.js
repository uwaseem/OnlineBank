import Mongoose from 'mongoose'

export default function (app) {
  const Accounts = Mongoose.model('Accounts')

  app.get('/accounts', async (req, res) => {
    try {
      const accounts = await Accounts.find()
      res.status(200).json(accounts)
    } catch (error) {
      console.error('Error while retrieving all accounts', error)
      res.sendStatus(500)
    }
  })

  app.get('/accounts/owner/:owner', async (req, res) => {
    const { owner } = req.params

    try {
      const account = await Accounts.find({ owner })
      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while retrieving account for user ${owner}`, error)
      res.sendStatus(500)
    }
  })

  app.get('/accounts/status/:status', async (req, res) => {
    const { status } = req.params

    try {
      const account = await Accounts.find({ status })
      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while retrieving all account with ${status} status`, error)
      res.sendStatus(500)
    }
  })

  app.post('/account', async(req, res) => {
    const accountInfo = req.body

    try {
      let account = await Accounts.findOne({ name: accountInfo.name })

      if (account) {
        return res.status(400).json({ message: 'account already exist' })
      }

      account = await Accounts.create(accountInfo)
      res.status(200).json(account)
    } catch (error) {
      console.error('Error while creating account', error)
      res.sendStatus(500)
    }
  })

  app.put('/account/name/:name', async(req, res) => {
    const { name } = req.params
    const accountInfo = req.body
    accountInfo.name = name

    try {
      const account = await Accounts.findOneAndUpdate({ name }, accountInfo, { new: true })
      res.status(200).json(account)
    } catch (error) {
      console.error('Error while updating account', error)
      res.sendStatus(500)
    }
  })

  app.patch('/account/name/:name/:status', async(req, res) => {
    const { name, status } = req.params
    const action = (status === 'close') ? 'closing' : 'opening'

    try {
      const account = await Accounts.findOneAndUpdate({ name }, { status }, { new: true })
      res.status(200).json(account)
    } catch (error) {
      console.error(`Error while ${action} account`, error)
      res.sendStatus(500)
    }
  })

  app.delete('/account/name/:name', async (req, res) => {
    const { name } = req.params

    try {
      const { result } = await Accounts.remove({ name })
      res.status(200).json(result)
    } catch (error) {
      console.error(`Error while deleting account ${name}`, error)
      res.sendStatus(500)
    }
  })
}
