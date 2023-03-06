const express = require('express')
const fs = require('fs').promises
const path_util = require('path')

const hbs = require('express-handlebars')
const formidable = require('formidable')

const PORT = 3000
const app = express()

app.set('views', path_util.join(__dirname, 'views'))
app.set('', path_util.join(__dirname, 'icons'))
app.engine(
    'hbs',
    hbs({
        defaultLayout: 'main.hbs',
        extname: '.hbs',
        partialsDir: path_util.join('views', 'partials'),
        helpers: {
            truncate: (str, len) =>
                str.length > len ? str.substring(0, len) + '...' : str,
        },
    })
)
app.set('view engine', 'hbs')
app.use(express.urlencoded({extended: true}))
app.use(express.json())

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
const exists = async (path) =>
    await fs
        .access(path)
        .then(() => true)
        .catch(() => false)
const dirs = (path) =>
    path
        .split(/\/|\\/g)
        .map((part) => part.trim())
        .filter((item) => ![''].includes(item))

const ls = async (path) => {
    if (!(await exists(path)))
        return {
            folders: [],
            files: [],
        }

    const list = await fs.readdir(path, {withFileTypes: true})

    const relativePath = relPath(path)
    return {
        folders: list
            .filter((item) => item.isDirectory())
            .map(({name}) => ({
                name,
                path: `/${
                    relativePath === '' ? '' : relativePath + '/'
                }${name}`,
            })),
        files: list
            .filter((item) => item.isFile())
            .map(({name}) => ({
                name,
                path: `/${
                    relativePath === '' ? '' : relativePath + '/'
                }${name}`,
            })),
    }
}

const mkFolder = async (path) => {
    if (await exists(path)) return Status.EXISTS

    await fs.mkdir(path, {recursive: true})

    return Status.SUCCESS
}
const mkFile = async (path, content = '') => {
    const [folder, file] = [path_util.dirname(path), path_util.basename(path)]

    if (await exists(path)) return Status.EXISTS

    await mkFolder(folder)

    await fs.writeFile(path, content)

    return Status.SUCCESS
}

const rm = async (path) => await fs.rm(path, {recursive: true})
const mv = async (path, newPath, isFile) => {
    try {
        if (!isFile)
            await mkFolder(newPath.split(/\/|\\/).slice(0, -1).join('/'))

        await fs.rename(path, newPath)
    } catch (e) {
        return Status.ERROR
    }
}

const pathDirs = (path) =>
    (dirs(relPath(path)) || []).reduce(
        (acc, dir, i) => [
            ...acc,
            {
                name: dir,
                path: `${acc[i - 1]?.path || ''}/${dir}`,
            },
        ],
        []
    )

app.use(express.static(path_util.join(__dirname, 'data')))

app.get('/', (req, res) => {
    res.redirect('/filemanager')
})

app.get('/filemanager', async (req, res) => {
    const currentPath = absPath(req.query.path || '')
    const relativePath = relPath(currentPath)

    const dirs = pathDirs(currentPath)

    const {folders, files} = await ls(currentPath)

    res.render('filemanager.hbs', {
        currentPath: `/${relativePath}`,
        dirs,
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
                          goback: true,
                      },
                      ...folders,
                  ],
        files: files.map((file) => ({
            ...file,
            icon: [
                'icons/default.svg',
                'icons/image.svg',
                'icons/video.svg',
                'icons/audio.svg',
            ][0],
        })),
    })
})

app.get('/cd', async (req, res) => {
    const path = parsePath(req.query.path)

    res.redirect(`/filemanager?path=${path}`)
})

app.post('/upload', async (req, res) => {
    formidable({
        multiples: true,
        uploadDir: path_util.join(__dirname, 'uploads'),
        keepExtensions: true,
    }).parse(req, async (err, fields, {files}) => {
        if (!Array.isArray(files)) files = [files]

        for (const file of files) {
            const newPath = absPath(
                parsePath(`${fields.currentPath}/${file.name}`)
            )

            await mv(file.path, newPath)
        }

        res.redirect(`/filemanager?path=${fields.currentPath}`)
    })
})
app.post('/mk/folder', async (req, res) => {
    const fullPath = absPath(
        parsePath(`${req.body.currentPath}/${req.body.path}`)
    )

    await mkFolder(fullPath)

    res.redirect(`/filemanager?path=${req.body.currentPath}`)
})
app.post('/mk/file', async (req, res) => {
    const fullPath = absPath(
        parsePath(`${req.body.currentPath}/${req.body.path}`)
    )
    const fileType = req.body.path.split('.')?.[1] || 'empty'

    const content = {
        js: 'console.log("Hello World!")',
        html: '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8">\n    <meta http-equiv="X-UA-Compatible" content="IE=edge">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n    <title>Hello World!</title>\n  </head>\n\n  <body>\n    <h1>Hello World!</h1>\n  </body>\n</html>',
        css: 'body {\n  background-color: #000;\n  color: #fff;\n}',
        json: '{\n  "name": "Hello World!"\n}',
        txt: 'Hello World!',
        xml: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <name>Hello World!</name>\n</root>',
        empty: '',
    }[fileType]

    await mkFile(fullPath, content)

    res.redirect(`/filemanager?path=${req.body.currentPath}`)
})

app.get('/rm', async (req, res) => {
    const path = absPath(parsePath(req.query.path))

    await rm(path)

    res.redirect(`/filemanager?path=${req.query.currentPath}`)
})
app.post('/mv/folder', async (req, res) => {
    const path = absPath(parsePath(req.body.oldPath))
    const newPath = absPath(parsePath(req.body.path))

    await mv(path, newPath, false)

    res.redirect(`/filemanager?path=${req.body.currentPath}`)
})
app.post('/mv/file', async (req, res) => {
    const path = absPath(parsePath(req.body.oldPath))
    const newPath = absPath(parsePath(req.body.path))

    await mv(path, newPath, true)

    res.redirect(`/filemanager?path=${req.body.currentPath}`)
})

app.get('/edit', async (req, res) => {
    const {path} = req.query

    const type =
        {
            js: 'text',
            html: 'text',
            css: 'text',
            json: 'text',
            txt: 'text',
            xml: 'text',
            png: 'image',
            jpg: 'image',
            jpeg: 'image',
            empty: 'text',
        }[path.split('.').pop() || 'empty'] || 'text'
    res.redirect(`/edit/${type}?path=${path}`)
})
app.get('/edit/text', async (req, res) => {
    const {path} = req.query
    const dirPath = path.split('/')?.slice(0, -1).join('/') || ''

    const dirs = pathDirs(absPath(dirPath))

    const content = await fs.readFile(absPath(path), 'utf-8')

    const preferences = await fs.readFile(
        path_util.join(__dirname, 'preferences.json'),
        'utf-8'
    )

    res.render('edit_text.hbs', {
        path,
        dirs,
        content,
        preferences: JSON.parse(preferences),
    })
})
app.get('/edit/image', async (req, res) => {
    const {path} = req.query
    const dirPath = path.split('/')?.slice(0, -1).join('/') || ''

    const dirs = pathDirs(absPath(dirPath))

    res.render('edit_image.hbs', {
        dirs,
        path,
        filters: [
            {
                name: 'original',
                value: 'none',
            },
            {
                name: 'grayscale',
                value: 'grayscale(100%)',
            },
            {
                name: 'blur',
                value: 'blur(5px)',
            },
            {
                name: 'sepia',
                value: 'sepia(100%)',
            },
            {
                name: 'invert',
                value: 'invert(100%)',
            },
            {
                name: 'hue-rotate',
                value: 'hue-rotate(90deg)',
            },
        ],
    })
})

app.post('/save', async (req, res) => {
    const {path, content} = req.body

    await fs.writeFile(absPath(path), content)

    res.redirect(`/edit?path=${path}`)
})

app.get('/preview', async (req, res) => {
    const {path} = req.query

    res.sendFile(absPath(path))
})

app.post('/preferences', async (req, res) => {
    const {path, fontSize, primaryColor, secondaryColor} = req.body

    await fs.writeFile(
        path_util.join(__dirname, 'preferences.json'),
        JSON.stringify({fontSize, primaryColor, secondaryColor}, null, 4)
    )

    res.redirect(`/edit?path=${path}`)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})