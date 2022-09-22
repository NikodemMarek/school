const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

app.get('/product_id/:id', (req, res) => {
  const id = req.params.id

  if (id > 0 && id < 3)
    res.sendFile(path.join(`${__dirname}/static/products/product-${id}.html`))
  else
    res.send('nie ma takiego produktu')
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})