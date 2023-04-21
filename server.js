const NodeHttpServer = require('./NodeHttpServer')
const router = require('./app/imageRouter')

const server = new NodeHttpServer()
router(server)
server.start(3000)
