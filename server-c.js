const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.send(
    req.query.degToRad === 'true'
      ? `${req.query.value} stopni = ${req.query.value * Math.PI / 180} radianiów`
      : `${req.query.value} radianów = ${req.query.value * 180 / Math.PI} stopni`
  )
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})