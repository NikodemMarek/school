const express = require('express')
const fs = require('fs').promises
const path = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

const parseDirs = (raw) =>
    raw
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => ![''].includes(item))
const pth = (...dirs) => path.join(__dirname, 'data', ...dirs)
const rlpth = (...dirs) => pth(...currentDirs, ...dirs)

const exists = async (path) =>
    await fs
        .access(path)
        .then(() => true)
        .catch(() => false)

const cd = async (dirs) =>
    await dirs.every(async (dir) => {
        if (['..'].includes(dir)) currentDirs.pop()
        else if (['~', '/'].includes(dir)) currentDirs = []
        else if (['', '.'].includes(dir)) return true
        else {
            if (!(await exists(rlpth(dir)))) return false

            currentDirs.push(dir)
        }

        return true
    })

const createFolder = async (dirs) => {
    const path = rlpth(...dirs)

    if (await exists(path)) throw new Error('Folder  already exists')
    await fs.mkdir(path, {recursive: true})

    return path
}
const createFile = async (dirs, name, content = '') => {
    try {
        if (await exists(rlpth(...dirs, name)))
            throw new Error('File already exists')

        if (!(await exists(rlpth(...dirs)))) await createFolder(dirs)

        const path = rlpth(...dirs, name)
        await fs.writeFile(path, content)

        return path
    } catch (e) {
        throw e
    }

    return ''
}

const rm = async (path) => await fs.rm(path, {recursive: true})

const listDir = async (dirs) => {
    const path = pth(...dirs)

    if (!(await exists(path)))
        return {
            folders: [],
            files: [],
        }

    const list = await fs.readdir(path, {withFileTypes: true})
    return {
        folders: list
            .filter((item) => item.isDirectory())
            .map(({name}) => ({name, path: pth(...dirs, name)})),
        files: list
            .filter((item) => item.isFile())
            .map(({name}) => ({name, path: pth(...dirs, name)})),
    }
}

let currentDirs = []

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
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.redirect('/filemanager')
})

app.get('/filemanager', async (req, res) => {
    const dirs = currentDirs.map((dir, i) => ({
        name: dir,
        path: ['~', ...currentDirs.slice(0, i + 1)].join('/'),
    }))
    const {folders, files} = await listDir([
        ...currentDirs,
        ...parseDirs(req.query.path || ''),
    ])

    res.render('filemanager.hbs', {
        dirs,
        folders: currentDirs.length > 0 ? [{name: '..'}, ...folders] : folders,
        files,
    })
})

app.post('/upload', (req, res) => {
    formidable({
        multiples: true,
        uploadDir: rlpth(),
        keepExtensions: true,
    }).parse(req, (err, fields, {files}) => {
        if (!Array.isArray(files)) files = [files]

        res.redirect('/filemanager')
    })
})
app.post('/create/folder', async (req, res) => {
    const fullPath = parseDirs(req.body.path)

    try {
        await createFolder(fullPath)
    } catch (e) {
        console.log(e)
    }

    res.redirect('/filemanager')
})
app.post('/create/file', async (req, res) => {
    const fullPath = parseDirs(req.body.path)
    const [file, ...dirs] = [fullPath.pop(), ...fullPath]

    try {
        await createFile(dirs, file)
    } catch (e) {
        console.log(e)
    }

    res.redirect('/filemanager')
})

app.get('/rm', async (req, res) => {
    const fullPath = req.query.path

    await rm(fullPath)

    res.redirect('/filemanager')
})

app.get('/cd', async (req, res) => {
    const dirs = parseDirs(req.query.path || '')

    await cd(dirs)

    res.redirect('/filemanager')
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})