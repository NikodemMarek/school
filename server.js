const NodeHttpServer = require('./NodeHttpServer')
const router = require('./app/router')

const server = new NodeHttpServer()
router(server)
server.start(3000)
