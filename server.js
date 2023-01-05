const express = require('express')
const fs = require('fs')
const path = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.engine(
    'hbs',
    hbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        partialsDir: path.join('views', 'partials'),
    })
)
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
    res.redirect('/filemanager')
})

app.get('/filemanager', (req, res) => {
    res.render('filemanager.hbs')
})

app.post('/upload', (req, res) => {
    const form = formidable({
        multiples: true,
        uploadDir: path.join(__dirname, 'data'),
        keepExtensions: true,
    })

    form.parse(req, (err, fields, files) => {})
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})