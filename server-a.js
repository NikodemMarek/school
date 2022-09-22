const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/koty', (req, res) => {
  res.sendFile(path.join(`${__dirname}/static/pages/koty.html`))
})
app.get('/auta', (req, res) => {
  res.sendFile(path.join(`${__dirname}/static/pages/auta.html`))
})
app.get('/drzewa', (req, res) => {
  res.sendFile(path.join(`${__dirname}/static/pages/drzewa.html`))
})

app.use(express.static('static'))
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})