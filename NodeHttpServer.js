const http = require('http')
const fs = require('fs').promises
const path_utils = require('path')

const ServerError = (code, msg) => ({code, msg})

const pathExists = async (path) =>
    await fs
        .access(path)
        .then(() => true)
        .catch(() => false)

const serveFn = async (path) => {
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
    #endpoints = {}
    addEndpoint = (endpoint, fn) => (this.#endpoints[endpoint] = fn)

    #server = null
    get server() {
        return this.#server
    }

    constructor(endpoints = {}) {
        this.#endpoints = endpoints

        this.#server = http.createServer(async (req, res) => {
            const [url, query] = decodeURIComponent(req.url).split('?')
            const path = url === '/' ? '/index.html' : url

            const sendError = (statusCode, message) => {
                res.statusCode = statusCode
                res.end(message)
            }

            const endpoint = this.#endpoints[path]

            try {
                const {body, headers} = endpoint
                    ? await endpoint({
                          query: query.split('&').reduce((acc, curr) => {
                              const [key, value] = curr.split('=')
                              acc[key] = value
                              return acc
                          }, {}),
                      })
                    : await serveFn(path)

                res.writeHead(200, {
                    headers,
                })
                res.write(body)
                res.end()
            } catch ({code, msg}) {
                console.error(`${code}: ${msg}`)
                sendError(code, msg)
            }
        })
    }

    start = (msg = 'Server started on port 3000', port = 3000) =>
        this.#server.listen(port, () => console.log(msg))
}

module.exports = NodeHttpServer
