const express = require('express')
const fs = require('fs')
const path = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

const parseDirs = (raw) =>
    raw
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => item !== '')
const pth = (...dirs) => path.join(__dirname, 'data', ...dirs)

const createFolder = (dirs) => {
    const path = pth(...dirs)

    if (!fs.existsSync(path)) fs.mkdirSync(path, {recursive: true})

    return path
}
const createFile = (dirs, name, content = '') => {
    if (!fs.existsSync(pth(...dirs))) createFolder(dirs)

    const path = pth(...dirs, name)

    fs.writeFileSync(path, content)

    return path
}

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
app.post('/create/folder', (req, res) => {
    const fullPath = parseDirs(req.body.path)

    createFolder(fullPath)
})
app.post('/create/file', (req, res) => {
    const fullPath = parseDirs(req.body.path)
    const [file, ...dirs] = [fullPath.pop(), ...fullPath]

    createFile(dirs, file)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})