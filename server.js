const PORT = 3000

const express = require('express')
const app = express()

app.use(express.static('static'))
app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})