const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  const divs = Array
    .apply(null, Array(parseInt(req.query.count)))
    .map((_, key) => `<div style='background-color: ${req.query.color}; display: inline-block; text-align: center; font-size: xx-large; color: white; margin: 2px; width: 100px; height: 100px;'>${key + 1}</div>`)

  res.send(divs.join(''))
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})