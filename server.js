const express = require('express')
const fs = require('fs').promises
const path_util = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

const parsePath = (raw) =>
    path_util.join(
        ...raw.split(/\/|\\/g).reduce((acc, dir) => {
            if (['..'].includes(dir)) acc.pop()
            else if (['~', '/'].includes(dir)) return []
            else if (['', '.'].includes(dir)) return acc
            else acc.push(dir)

            return acc
        }, [])
    )
const parseDirs = (raw) =>
    raw
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => ![''].includes(item))
const pth = (...dirs) => path_util.join(__dirname, 'data', ...dirs)
const rlpth = (...dirs) => pth(...currentDirs, ...dirs)
const addPth = (...paths) =>
    path_util.join(paths.map((pth) => parseDirs(pth)).flat(Infinity))

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

const createFolder = async (path) => {
    await fs.mkdir(path, {recursive: true})

    return path
}
const createFile = async (path, name, content = '') => {
    if (!(await exists(path))) await createFolder(dirs)

    const fPath = parsePath(`${path}/${name}`)

    await fs.writeFile(fPath, content)

    return fPath
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

app.set('views', path_util.join(__dirname, 'views'))
app.engine(
    'hbs',
    hbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        partialsDir: path_util.join('views', 'partials'),
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
}) >
    app.post('/create/folder', async (req, res) => {
        const fullPath = parseDirs(req.body.path)

        await createFolder(rlpth(...fullPath))

        res.redirect('/filemanager')
    })
app.post('/create/file', async (req, res) => {
    const fullPath = parseDirs(req.body.path)
    const [file, path] = [fullPath.pop(), rlpth(fullPath)]

    await createFile(path, file)

    res.redirect('/filemanager')
})

app.get('/rm', async (req, res) => {
    const path = parsePath(req.query.path)

    await rm(path)

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