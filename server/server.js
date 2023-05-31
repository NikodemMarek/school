const NodeHttpServer = require('./NodeHttpServer')
const jwt = require('jsonwebtoken')

require('dotenv').config()

if (!process.env.SECRET_KEY)
    throw new Error('SECRET_KEY is not defined')

const server = new NodeHttpServer((auth, url, method) => {
    if (
        method === "get" && [
            '/api',
            '/api/users',
            '/api/users/confirm',
        ].includes(url)
        || method === "post" && [
            '/api/users/register',
            '/api/users/login',
        ].includes(url)
    )
        return -1

    if (auth?.startsWith('Bearer ')) {
        const token = auth.split(' ')[1].trim()

        try {
            const tokenData = jwt.verify(token, process.env.SECRET_KEY)

            return tokenData.id
        } catch (err) {
            return undefined
        }
    }

    return undefined
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
