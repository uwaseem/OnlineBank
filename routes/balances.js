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
      res.sendStatus(500)
    }
  })

  app.get('/balance/account/owner/:owner', async (req, res) => {
    const { owner } = req.params

    try {
      const accounts = await Accounts.find({ owner })
      const result = accounts.map((account) => {
        const { balance, name, owner } = account
        return { balance, name, owner }
      })

      res.status(200).json(result)
    } catch (error) {
      console.error(`Error while retrieving balance for owner ${owner}`, error)
      res.sendStatus(500)
    }
  })

  app.put('/balance/account/name/:name/:action', async (req, res) => {
    const { action, name } = req.params
    const { amount } = req.body

    if (action !== BalanceActions.Deposit && action !== BalanceActions.Withdraw) {
      const message = `${action} is an invalid action`
      console.info(message)
      return res.status(400).json({ message })
    }

    try {
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
