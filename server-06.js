const express = require('express')
const path = require('path')
const formidable = require('formidable')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

app.get('/', (req, res) => {
  const text = { text: "Lorem ipsum dolor sit amet qui minim labore adipisicing minim sint cillum sint consectetur cupidatat" }
  res.render('index-06.hbs', text)
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({
  defaultLayout: 'main.hbs',
  helpers: {
    shorten: text => text.substring(10),
    caps: text => text.split(' ').map(word => word[0].toUpperCase() + word.substring(1, word.length)).join(' '),
    dash: text => text.split(' ').map(word => word.split('').join('-')).join(' '),
  },
}))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})
