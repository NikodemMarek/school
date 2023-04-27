const NodeHttpServer = require('./NodeHttpServer')
const router = require('./app/images/router')

const server = new NodeHttpServer()
router(server)
server.start(3000)
