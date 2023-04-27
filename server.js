const NodeHttpServer = require('./NodeHttpServer')
const images = require('./app/images/router')
const tags = require('./app/tags/router')

const server = new NodeHttpServer()

server.get('/api', ({}) => ({
    body: 'welcome to the api',
    headers: {
        'Content-Type': 'text/plain',
    },
}))

images('/api/photos', server)
tags('/api/tags', server)

server.start(3000)
