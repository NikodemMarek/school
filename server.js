const express = require('express')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.end('ok')
})

app.listen(PORT, () => {
  req.send(`server listening on port ${PORT}`)
})