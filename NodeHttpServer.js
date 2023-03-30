const http = require('http')
const fs = require('fs').promises
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

    #endpoints = {get: {}, post: {}}
    get = (endpoint, fn) => (this.#endpoints.get[endpoint] = fn)
    post = (endpoint, fn) => (this.#endpoints.post[endpoint] = fn)

    constructor({get, post} = {get: {}, post: {}}) {
        this.#endpoints.get = get
        this.#endpoints.post = post

        this.#server = http.createServer(async (req, res) => {
            const sendError = (statusCode, message) => {
                res.statusCode = statusCode
                res.end(message)
            }

            const method = req.method.toLowerCase()
            const [url, rawQuery] = decodeURIComponent(req.url).split('?')
            const query = Object.fromEntries(new URLSearchParams(rawQuery))

            const parts = url.toLowerCase().split('/') || []
            const endpointStr = parts
                .reduce((acc) => {
                    if (this.#endpoints[method]?.[acc.join('/')]) return acc

                    acc.pop()
                    return acc
                }, parts)
                .join('/')

            const endpoint = this.#endpoints[method]?.[endpointStr]
            const urlParams = endpointStr
                .replace(parts.join('/'), '')
                .split('/')

            const path = url === '/' ? '/index.html' : url

            const reqBody = await new Promise((resolve) => {
                const body = {}

                req.on('data', (chunk) => {
                    Object.assign(
                        body,
                        Object.fromEntries(
                            new URLSearchParams(chunk.toString())
                        )
                    )
                })
                req.on('end', async () => resolve(body))
            })

            try {
                const {body, headers} = endpoint
                    ? await endpoint({query, body: reqBody, urlParams})
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
