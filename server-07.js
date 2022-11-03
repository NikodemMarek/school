const express = require('express')
const path = require('path')
const formidable = require('formidable')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

const { books } = require('./data/data.json')

app.get('/', (req, res) => {
  res.render('index-07.hbs', { books })
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  extname: '.hbs',
  partialsDir: 'views/partials',
}))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
