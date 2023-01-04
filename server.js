const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const formidable = require('formidable')
const Datastore = require('nedb')

const PORT = 3000
const app = express()

app.set('views', path.join(__dirname, `views`))
app.engine(
    'hbs',
    hbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        partialsDir: 'views/partials',
    })
)
app.set('view engine', 'hbs')
app.use('/icons', express.static(path.join(__dirname, 'icons')))

const fileDB = new Datastore({
    filename: path.join('db', 'files.db'),
    autoload: true,
})

const files = fileDB.getAllData()
let nextId = files.length > 0 ? files[files.length - 1]._id + 1 : 0

const FileIcons = {
    image: 'file_type_image.svg',
    video: 'file_type_video.svg',
    audio: 'file_type_audio.svg',
    text: 'file_type_text.svg',
    application: 'file_type_default.svg',
}

app.get('/', (req, res) => {
    res.render('upload.hbs', {})
})

app.post('/upload', (req, res) => {
    let form = formidable({})

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, 'db', 'files')

    form.parse(req, function (err, fields, {files}) {
        if (!Array.isArray(files)) files = [files]

        toUpload = files.map(({path, type, name, size}) => ({
            _id: `${nextId++}`,
            savedate: Date.now(),
            path,
            type,
            name,
            size,
        }))
        fileDB.insert(toUpload, (e, docs) => console.log(e || docs))

        res.redirect('/filemanager')
    })
})

app.get('/filemanager', (req, res) => {
    const files = fileDB
        .getAllData()
        .map((file) => ({
            ...file,
            icon: path.join(
                'icons',
                FileIcons[(file.type || '/').split('/')[0]] ||
                    'file_type_default.svg'
            ),
        }))
        .sort((a, b) => parseInt(a._id) - parseInt(b._id))
    res.render('filemanager.hbs', {files})
})
app.get('/show', (req, res) => {
    fileDB.findOne({_id: req.query.id}, (e, doc) => {
        console.log(e || doc)
        if (e || doc === null) return res.redirect('/filemanager')

        res.setHeader('Content-Type', doc.type)
        res.sendFile(doc.path)
    })
})
app.get('/info', (req, res) => {
    fileDB.findOne({_id: req.query.id}, (e, doc) => {
        console.log(e || doc)
        if (e || doc === null) return res.redirect('/filemanager')

        res.render('info.hbs', doc)
    })
})

app.get('/delete', (req, res) => {
    fileDB.remove({_id: req.query.id}, (e, doc) => console.log(e || doc))

    res.redirect('/filemanager')
})
app.get('/reset', (req, res) => {
    fileDB.remove({}, {multi: true}, (e, doc) => {
        console.log(e || doc)
        res.redirect('/filemanager')
    })
})

app.get('/download', (req, res) => {
    fileDB.findOne({_id: req.query.id}, (e, doc) => {
        console.log(e || doc)
        if (e || doc === null) return res.redirect('/filemanager')

        res.download(doc.path)
    })
})

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
