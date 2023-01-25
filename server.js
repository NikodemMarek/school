const express = require('express')
const fs = require('fs').promises
const path_util = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

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

const Status = Object.freeze({
    SUCCESS: 0,
    ERROR: 1,
    EXISTS: 2,
})

const parsePath = (raw) =>
    path_util.join(
        ...raw.split(/\/|\\/g).reduce((acc, dir, i) => {
            if (['..'].includes(dir)) acc.pop()
            else if (['~', '/'].includes(dir)) return []
            else if (['', '.'].includes(dir)) return acc
            else acc.push(dir)

            return acc
        }, [])
    )
const absPath = (path) => path_util.join(__dirname, 'data', path)
const relPath = (path) =>
    path_util.relative(path_util.join(__dirname, 'data'), path)

const dirs = (path) =>
    path
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => ![''].includes(item))

const addPth = (...paths) =>
    path_util.join(paths.map((pth) => dirs(pth)).flat(Infinity))

const exists = async (path) =>
    await fs
        .access(path)
        .then(() => true)
        .catch(() => false)

const mkFolder = async (path) => {
    if (await exists(path)) return Status.EXISTS

    await fs.mkdir(path, {recursive: true})

    return Status.SUCCESS
}
const mkFile = async (path, content = '') => {
    const [folder, file] = [path_util.dirname(path), path_util.basename(path)]
    console.log(folder, file)

    if (await exists(path)) return Status.EXISTS

    await mkFolder(folder)

    await fs.writeFile(path, content)

    return Status.SUCCESS
}

const rm = async (path) => await fs.rm(path, {recursive: true})

const ls = async (path) => {
    if (!(await exists(path)))
        return {
            folders: [],
            files: [],
        }

    const list = await fs.readdir(path, {withFileTypes: true})
    return {
        folders: list
            .filter((item) => item.isDirectory())
            .map(({name}) => ({name, path: `${relPath(path)}/${name}`})),
        files: list
            .filter((item) => item.isFile())
            .map(({name}) => ({name, path: `${relPath(path)}/${name}`})),
    }
}

app.get('/', (req, res) => {
    res.redirect('/filemanager')
})

app.get('/filemanager', async (req, res) => {
    const currentPath = absPath(req.query.path || '')
    const relativePath = relPath(currentPath)

    const pathDirs = (dirs(relativePath) || []).reduce(
        (acc, dir, i) => [
            ...acc,
            {
                name: dir,
                path: `${acc[i - 1]?.path || ''}/${dir}`,
            },
        ],
        []
    )

    const {folders, files} = await ls(currentPath)

    res.render('filemanager.hbs', {
        dirs: pathDirs,
        folders:
            relativePath === ''
                ? folders
                : [
                      {
                          name: '..',
                          path: relativePath
                              .split(/\/|\\/)
                              .slice(0, -1)
                              .join('/'),
                      },
                      ...folders,
                  ],
        files,
    })
})

app.post('/upload', (req, res) => {
    // TODO: Save files to separate folder and rename them.
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
    const fullPath = absPath(parsePath(req.body.path))

    await mkFolder(fullPath)

    res.redirect('/filemanager')
})
app.post('/create/file', async (req, res) => {
    const fullPath = absPath(parsePath(req.body.path))

    await mkFile(fullPath)

    res.redirect('/filemanager')
})

app.get('/rm', async (req, res) => {
    const path = absPath(parsePath(req.query.path))

    await rm(path)

    res.redirect('/filemanager')
})

app.get('/cd', async (req, res) => {
    const path = parsePath(req.query.path)

    res.redirect(`/filemanager?path=${path}`)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})