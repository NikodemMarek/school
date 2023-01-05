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
app.use(express.json())

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

    form.parse(req, (err, fields, files) => {
        console.log(files)
    })
})
app.post('/create', (req, res) => {
    const fullPath = req.body.path
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => item !== '')
    const [file, absolutePath] = [
        fullPath.pop(),
        path.join(__dirname, ...fullPath),
    ]

    console.log(absolutePath, file)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})