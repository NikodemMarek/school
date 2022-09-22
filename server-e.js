const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.send(Array.apply(null, Array(50))
    .map((_, key) => `<a href='product/${key}'>${key}</a>`)
    .join('<br>')
  )
})

app.get('/product/:id', (req, res) => {
  const id = req.params.id

  res.send(`podstrona z danymi produktu o id = ${id}`)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})