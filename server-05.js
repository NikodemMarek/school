const express = require('express')
const path = require('path')
const formidable = require('formidable')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

const context = require('./data/data.json')

app.get('/', (req, res) => {
  res.render('index-05.hbs', context)
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
