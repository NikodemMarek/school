const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()
app.use(express.json())

app.post('/post', (req, res) => {
  res.send(JSON.stringify({
    sum: parseInt(req.body.x) + parseInt(req.body.y),
    multi: parseInt(req.body.x) * parseInt(req.body.y)
  }))
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/index-3.html'))
})
app.get('/lib/jq.js', (req, res) => {
  res.sendFile(path.join(__dirname, '/pages/lib/jq.js'))
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})