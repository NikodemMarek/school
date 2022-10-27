const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

const context = {
  subject: 'ćwiczenie 2 - podstawowy context',
  content: 'to jest treść',
  footer: 'to jest stopka',
}

app.get('/', (req, res) => {
  res.render('index-02.hbs', context)
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})