import Mongoose from 'mongoose'

export default function (app) {
  const Accounts = Mongoose.model('Accounts')
  const AccountActions = {
    Close: 'close',
    Open: 'open'
  }
  const BalanceActions = {
    Deposit: 'deposit',
    Withdraw: 'withdraw'
  }

  app.get('/balance/account/name/:name', async (req, res) => {
    const { name } = req.params

    try {
      const account = await Accounts.findOne({ name })

      if (!account) {
        return res.status(400).json({ message: `Account ${name} does not exist` })
      }

      res.status(200).json({ balance: account.balance })
    } catch (error) {
      console.error(`Error while retrieving balance for account ${name}`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.get('/balance/accounts/user/:user', async (req, res) => {
    const { user } = req.params

    try {
      const accounts = await Accounts.find({ user })

      if (accounts && accounts.length < 1) {
        return res.status(404).json({ message: `User ${user} does not have any account` })
      }

      const result = accounts.map((account) => {
        const { balance, name, user, status } = account
        return { balance, name, user, status }
      })

      res.status(200).json(result)
    } catch (error) {
      console.error(`Error while retrieving balance for user ${user}`, error)
      res.status(500).json({ message: error.message })
    }
  })

  app.put('/balance/account/name/:name/:action', async (req, res) => {
    const { action, name } = req.params
    let { amount } = req.body

    if (!amount) {
      return res.status(400).json({ message: `No amount specified` })
    }

    if (action !== BalanceActions.Deposit && action !== BalanceActions.Withdraw) {
      return res.status(400).json({ message: `${action} is an invalid action` })
    }

    try {
      amount = parseInt(amount)

      if (amount < 0) {
        return res.status(400).json({ message: `${amount} is not a valid amount to ${action}` })
      }

      const account = await Accounts.findOne({ name })

      if (!account) {
        return res.status(400).json({ message: `Account ${name} does not exist` })
      }

      const { balance, status } = account
      let newAmount

      if (status === AccountActions.Close) {
        return res.status(403).json({ message: 'Account has been closed' })
      }

      if (action === BalanceActions.Deposit) {
        newAmount = balance + amount
      } else {
        newAmount = balance - amount

        if (newAmount < 0) {
          return res.status(400).json({ message: 'Amount requested more than balance' })
        }
      }

      const updatedAccount = await Accounts.findOneAndUpdate({ name }, { balance: newAmount }, { new: true })
      return res.status(200).json(updatedAccount)
    } catch (error) {
      console.error(`Error while performing ${action} action for account ${name}`, error)
      res.sendStatus(500)
    }
  })
}
