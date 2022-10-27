const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

app.get('/index', (req, res) => {
  res.render('index-01.hbs')
})
app.get('/login', (req, res) => {
  res.render('login-01.hbs')
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})