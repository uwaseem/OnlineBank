import Moment from 'moment'
import Mongoose from 'mongoose'

// import AccountActions from '../actions/account'
import Transfer from '../api/transfer'

export default function (app) {
  const Accounts = Mongoose.model('Accounts')
  // const Account = AccountActions()
  const transfer = Transfer()

  const AccountActions = {
    Close: 'close',
    Open: 'open'
  }
  const BalanceActions = {
    Deposit: 'deposit',
    Withdraw: 'withdraw',
    Transfer: 'transfer'
  }

 /*  app.get('/balance/account/name/:name', async (req, res) => {
    const { name } = req.params

    try {
      const accounts = await Account.getAccountBalanceByName(name)
      res.status(accounts.code).json({ message: accounts.message })
    } catch (error) {
      console.error(`Error while retrieving balance for account ${name}`, error)
      res.status(500).json({ message: error.message })
    }
  }) */

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

    amount = parseInt(amount)

    if (!amount || amount < 0) {
      return res.status(400).json({ message: `${amount} is not a valid amount to ${action}` })
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
      res.status(500).json({ message: error.message })
    }
  })

  app.post('/balance/account/name/:name/:action', async (req, res) => {
    const { action, name } = req.params
    const { name: receivingAccount } = req.body
    let { amount } = req.body

    if (action === BalanceActions.Withdraw || action === BalanceActions.Deposit) {
      return res.status(400).json({ message: `Try a /PUT method instead` })
    }

    if (action !== BalanceActions.Transfer) {
      return res.status(400).json({ message: `${action} is an invalid action` })
    }

    if (!amount || !receivingAccount) {
      return res.status(400).json({ message: `Incomplete information. Need both amount and account name` })
    }

    amount = parseInt(amount)

    if (!amount || amount < 0) {
      return res.status(400).json({ message: `${amount} is not a valid amount to ${action}` })
    }

    try {
      const accountA = await Accounts.findOne({ name })
      const accountB = await Accounts.findOne({ name: receivingAccount })

      if (!accountA || !accountB) {
        const missingAccount = (!accountA) ? name : receivingAccount
        return res.status(400).json({ message: `Account ${missingAccount} does not exist` })
      }

      if (accountA.status === AccountActions.Close || accountB.status === AccountActions.Close) {
        return res.status(400).json({ message: 'Cannot transfer to or from closed accounts' })
      }

      const lastTransferToday = Moment(accountA.lastTransfer).isSame(Moment.utc().format(), 'day')

      accountA.dailyTransferAmount = (lastTransferToday) ? amount + accountA.dailyTransferAmount : amount

      if (accountA.dailyTransferAmount > 10000) {
        return res.status(400).json({ message: 'Daily transfer limit of 10000 exceeded' })
      }

      const accountsSameOwner = (accountA.user === accountB.user)

      if (!accountsSameOwner) {
        const transferApproved = await transfer.isTransferApproved()

        if (!transferApproved) {
          return res.status(400).json({ message: `Failed to get approval for this transfer` })
        }
      }

      let newBalanceA = accountA.balance - amount
      const newBalanceB = accountB.balance + amount

      if (newBalanceA < 0) {
        return res.status(400).json({ message: `Cannot transfer more than existing balance of ${accountA.balance}` })
      }

      newBalanceA = (!accountsSameOwner) ? newBalanceA - 100 : newBalanceA

      if (newBalanceA < 0) {
        return res.status(400).json({ message: `Not enough balance to cover transfer fee` })
      }

      const { dailyTransferAmount } = accountA

      const accounts = await Promise.all([
        Accounts.findOneAndUpdate({ name }, { balance: newBalanceA, dailyTransferAmount, lastTransfer: Moment.utc().format() }, { new: true }),
        Accounts.findOneAndUpdate({ name: receivingAccount }, { balance: newBalanceB }, { new: true })
      ])

      res.status(200).json(accounts)
    } catch (error) {
      console.error(`Error while transfering money for account ${name}`, error)
      res.status(500).json({ message: error.message })
    }
  })
}
