const express = require('express')
const path = require('path')
const formidable = require('formidable')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/pages/02.html`))
})
app.post('/res', (req, res) => {
  const form = formidable({})
  form.keepExtensions = true
  form.uploadDir = `${__dirname}/imgs/`
  form.parse(req, (err, fields, files) => {
    console.log(err);
    res.send(JSON.stringify([ fields, files ], null, 4))
  })
})

app.listen(PORT, () => {})