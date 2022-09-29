const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()
app.use(express.json())

app.post('/post', (req, res) => {
  console.log(req.body);
  res.send(JSON.stringify(req.body))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/index-4.html'))
})
app.get('/lib/jq.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/lib/jq.js'))
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})