const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.end('ok')
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})