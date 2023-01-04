const express = require('express')
const path = require('path')
const hbs = require('express-handlebars')
const formidable = require('formidable')

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

const getFiles = () => files

const getFile = async (id) =>
    await new Promise((resolve, reject) => {
        const file = files.find((file) => file._id === id)

        resolve(file)
    })
const addFiles = async (newFiles) =>
    await new Promise((resolve, reject) => {
        files = files.concat(
            newFiles.map((file) => ({
                ...file,
                _id: `${nextId++}`,
                savedate: Date.now(),
            }))
        )
        resolve()
    })
const deleteFile = async (id) =>
    await new Promise((resolve, reject) => {
        const rmFrom = files.findIndex((file) => file._id === id)

        if (rmFrom === -1) reject()

        files.splice(rmFrom, 1)
        resolve()
    })
const clearFiles = async () =>
    await new Promise((resolve, reject) => {
        files = []
        resolve()
    })

let files = []
let nextId = 0

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

app.post('/upload', async (req, res) => {
    let form = formidable({})

    form.multiples = true
    form.keepExtensions = true
    form.uploadDir = path.join(__dirname, 'db', 'files')

    form.parse(req, async (err, fields, {files: fls}) => {
        if (!Array.isArray(fls)) fls = [fls]

        toUpload = fls.reduce((acc, {path, type, name, size}) => {
            if (type === 'application/octet-stream') return acc
            return [
                ...acc,
                {
                    path,
                    type,
                    name,
                    size,
                },
            ]
        }, [])
        await addFiles(toUpload).catch((e) => console.log(e))

        res.redirect('/filemanager')
    })
})

app.get('/filemanager', (req, res) => {
    const fls = getFiles()
        .map((file) => ({
            ...file,
            icon: path.join(
                'icons',
                FileIcons[(file.type || '/').split('/')[0]] ||
                    'file_type_default.svg'
            ),
        }))
        .sort((a, b) => parseInt(a._id) - parseInt(b._id))
    res.render('filemanager.hbs', {files: fls})
})
app.get('/show', async (req, res) => {
    const file = await getFile(req.query.id)

    if (!file) return res.redirect('/filemanager')

    res.setHeader('Content-Type', file.type)
    res.sendFile(file.path)
})
app.get('/info', async (req, res) => {
    const file = await getFile(req.query.id)

    if (!file) return res.redirect('/filemanager')
    res.render('info.hbs', file)
})

app.get('/delete', async (req, res) => {
    await deleteFile(req.query.id)

    res.redirect('/filemanager')
})
app.get('/reset', async (req, res) => {
    await clearFiles()

    res.redirect('/filemanager')
})

app.get('/download', async (req, res) => {
    const file = await getFile(req.query.id)

    if (!file) return res.redirect('/filemanager')
    res.download(file.path)
})

app.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`)
})
