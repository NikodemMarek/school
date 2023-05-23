require('dotenv').config()

const NodeHttpServer = require('./NodeHttpServer')
const server = new NodeHttpServer()

server.get('/api', ({}) => ({
    body: 'welcome to the api',
    headers: {
        'Content-Type': 'text/plain',
    },
}))

require('./app/images/router')('/api/photos', server)
require('./app/tags/router')('/api/tags', server)
require('./app/filters/router')('/api/filters', server)
require('./app/users/router')('/api/users', server)

server.start(process.env.PORT)
