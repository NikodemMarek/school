const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()
app.use(express.urlencoded({
  extended: true
}))

app.post('/handle', (req, res) => {
  res.setHeader('content-type', 'text/json')
  res.send(JSON.stringify(req.body, null, 4))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/index-1.html'))
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})