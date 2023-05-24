const NodeHttpServer = require('./NodeHttpServer')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const server = new NodeHttpServer((auth, url) => {
    if (url?.startsWith('/api/users'))
        return true

    if (auth?.startsWith('Bearer ')) {
        const token = auth.split(' ')[1].trim()

        if (!process.env.SECRET_KEY)
            return false

        try {

            const tokenData = jwt.verify(token, process.env.SECRET_KEY)

            if (!tokenData)
                return false

            return true
        } catch (err) {
            return false
        }
    }

    return false
})

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
