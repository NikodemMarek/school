const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/pages/05.html`))
})
app.post('/pf', (req, res) => {
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify(req.body))
})

app.listen(PORT, () => {})