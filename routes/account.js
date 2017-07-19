export default function (app) {
  app.get('/accounts', (req, res) => {
    res.status(200).json({ message: 'wow' })
  })

  app.post('/account', (req, res) => {
    res.status(200).json({ message: 'success' })
  })
}
