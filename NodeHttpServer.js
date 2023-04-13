const http = require('http')
const fs = require('fs').promises
const formidable = require('formidable')
const path_utils = require('path')

const ServerError = (code, msg) => ({code, msg})

const pathExists = async (path) =>
    await fs
        .access(path)
        .then(() => true)
        .catch(() => false)

const sendFile = async (path) => {
    const extension = path_utils.extname(path)

    const contentType = {
        '.html': {
            mimeType: 'text/html',
        },
        '.js': {
            mimeType: 'text/javascript',
        },
        '.css': {
            mimeType: 'text/css',
        },
        '.png': {
            mimeType: 'image/png',
        },
        '.jpg': {
            mimeType: 'image/jpg',
        },
    }[extension]

    if (!contentType)
        throw ServerError(400, `File of type '${extension}' is not supported!`)

    const absolutePath = path_utils.join(__dirname, 'static', path)

    if (!(await pathExists(absolutePath)))
        throw ServerError(404, `File '${path}' not found!`)

    const body = await fs.readFile(absolutePath, 'utf-8')

    return {
        body,
        headers: {
            'Content-Type': contentType.mimeType,
        },
    }
}

class NodeHttpServer {
    #server = null

    #endpoints = {
        endpoints: {},
    }

    createEndpoint = (endpoints, parts, method, fn) => {
        if (parts.length === 1)
            return {
                ...endpoints,
                [`/${parts[0]}`]: {
                    ...(endpoints?.[`/${parts[0]}`] || {}),
                    [method]: fn,
                },
            }

        return {
            ...endpoints,
            [`/${parts[0]}`]: {
                ...(endpoints?.[`/${parts[0]}`] || {}),
                endpoints: this.createEndpoint(
                    endpoints[`/${parts[0]}`]?.endpoints,
                    parts.slice(1),
                    method,
                    fn
                ),
            },
        }
    }
    get = (endpoint, fn) => {
        if (endpoint === '/') {
            this.#endpoints['get'] = fn
            return
        }

        this.#endpoints.endpoints = this.createEndpoint(
            this.#endpoints.endpoints,
            endpoint.split('/').slice(1),
            'get',
            fn
        )
    }
    post = (endpoint, fn) => {
        if (endpoint === '/') {
            this.#endpoints['post'] = fn
            return
        }

        this.#endpoints.endpoints = this.createEndpoint(
            this.#endpoints.endpoints,
            endpoint.split('/').slice(1),
            'post',
            fn
        )
    }

    constructor() {
        this.#server = http.createServer(async (req, res) => {
            const sendError = (statusCode, message) => {
                res.statusCode = statusCode
                res.end(message)
            }
            const method = req.method.toLowerCase()
            const [rawUrl, rawQuery] = decodeURIComponent(req.url).split('?')
            const query = Object.fromEntries(new URLSearchParams(rawQuery))

            let path = ''

            const url = rawUrl.toLowerCase()
            const endpoint = url.split('/')?.reduce((acc, part) => {
                const endpoint = acc?.endpoints?.[`/${part}`]

                if (!endpoint) return acc

                path += `/${part}`
                return endpoint
            }, this.#endpoints)?.[method]

            const urlParams = url.replace(path, '').split('/')

            if (!endpoint) path = url === '/' ? '/index.html' : url

            const form = formidable({multiples: true, keepExtensions: true})
            form.uploadDir = path_utils.join(__dirname, 'uploads')
            const {fields: reqBody, files} = await new Promise(
                (resolve, reject) => {
                    form.parse(req, (err, fields, rawFiles) => {
                        if (err) return reject({err, fields: {}, files: []})

                        const files = Object.keys(rawFiles).map((key) => {
                            const file = rawFiles[key]

                            return {
                                path: file.path,
                                name: key,
                                originalName: file.name,
                                type: file.type,
                            }
                        })

                        resolve({
                            fields,
                            files,
                        })
                    })
                }
            )

            try {
                const {body, headers} = endpoint
                    ? await endpoint({files, query, body: reqBody, urlParams})
                    : await sendFile(path)

                res.writeHead(200, {
                    headers,
                })
                res.write(body)
                res.end()
            } catch (err) {
                console.error(err)

                if (err?.code && err?.msg) sendError(err.code, err.msg)
                else sendError(500, 'Internal Server Error!')
            }
        })
    }

    start = (msg = 'Server started on port 3000', port = 3000) =>
        this.#server.listen(port, () => console.log(msg))
}

module.exports = NodeHttpServer
