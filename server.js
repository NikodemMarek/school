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
        html: '<!DOCTYPE html>\n<html lang="en">\n\t<head>\n\t\t<meta charset="UTF-8">\n\t\t<meta http-equiv="X-UA-Compatible" content="IE=edge">\n\t\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\n\t\t<title>Hello World!</title>\n\t</head>\n\n\t<body>\n\t\t<h1>Hello World!</h1>\n\t</body>\n</html>',
        css: 'body {\n\tbackground-color: #000;\n\tcolor: #fff;\n}',
        json: '{\n\t"name": "Hello World!"\n}',
        txt: 'Hello World!',
        xml: '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n\t<name>Hello World!</name>\n</root>',
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
    const path = absPath(parsePath(req.query.path))
    const currentPath = req.query.currentPath

    const type = {
        js: 'text',
        html: 'text',
        css: 'text',
        json: 'text',
        txt: 'text',
        xml: 'text',
        png: 'image',
        jpg: 'image',
        jpeg: 'image',
    }[path.split('.').pop() || 'empty']
    res.redirect(`/edit/${type}?currentPath=${currentPath}&path=${path}`)
})
app.get('/edit/text', async (req, res) => {
    const path = parsePath(req.query.path)
    const relativePath = relPath(`/${path}`)
    const currentPath = req.query.currentPath

    const dirs = pathDirs(absPath(currentPath))

    const content = await fs.readFile(`/${path}`, 'utf-8')

    res.render('editor.hbs', {
        path: `/${relativePath}`,
        dirs,
        content,
    })
})
app.get('/edit/image', async (req, res) => {
    const path = parsePath(req.query.path)
    const relativePath = relPath(`/${path}`)
    const currentPath = req.query.currentPath

    const dirs = pathDirs(absPath(currentPath))

    res.render('edit_image.hbs', {
        dirs,
        path: `/${relativePath}`,
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
    const path = absPath(parsePath(req.body.path))
    const content = req.body.content

    await fs.writeFile(path, content)

    res.redirect(`/filemanager?path=${req.body.currentPath}`)
})

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`)
})