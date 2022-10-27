const express = require('express')
const path = require('path')
const formidable = require('formidable')
const hbs = require('express-handlebars')

const PORT = 3000
const app = express()

const context = {
  subject: 'ćwiczenie 4 - dane z tablicy obiektów',
  fields: [
    'title',
    'author',
    'lang',
  ],
  books: [
    { title: 'lalka', author: 'B. Prus', lang: 'PL' },
    { title: 'Hamlet', author: 'W. Szekspir', lang: 'ENG' },
    { title: 'Pieśń lodu i ognia', author: 'G. Martin', lang: 'ENG' },
    { title: 'The Hobbit', author: 'J. Tolkien', lang: 'ENG' },
  ],
}

app.get('/', (req, res) => {
  res.render('index-04.hbs', context)
})
app.post('/handle', (req, res) => {
  const form = formidable({})
  form.parse(req, (err, fields) => {
    console.log(err);
    console.log(fields);
    const { toShow } = fields

    const books = context.books.map(book => {
      return toShow.reduce((acc, field) => {
        acc[field] = book[field]
        return acc
      }, {})
    })
    
    console.log(books);
    res.render('handle-04.hbs', { books })
  })
})

app.set('views', path.join(__dirname, `views`))
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }))
app.set('view engine', 'hbs')

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})