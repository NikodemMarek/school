const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

const context = {
  subject: 'ćwiczenie 3 - dane z tablicy obiektów',
  books: [
    { title: 'lalka', author: 'B. Prus', lang: 'PL' },
    { title: 'Hamlet', author: 'W. Szekspir', lang: 'ENG' },
    { title: 'Pieśń lodu i ognia', author: 'G. Martin', lang: 'ENG' },
    { title: 'The Hobbit', author: 'J. Tolkien', lang: 'ENG' },
  ],
}

app.get('/', (req, res) => {
  res.render('index-03.hbs', context)
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})