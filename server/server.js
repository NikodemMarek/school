const NodeHttpServer = require('./NodeHttpServer')

const jwt = require('jsonwebtoken')
const users = require('./app/users/model').users

require('dotenv').config()

if (!process.env.SECRET_KEY)
    throw new Error('SECRET_KEY is not defined')

const server = new NodeHttpServer((auth, url, method) => {
    if (
        method === "get" && ![
            '/api/users/me',
            '/api/photos/albums/me',
            '/api/users/logout',
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

            if (!tokenData)
                return undefined

            if (tokenData.confirmation === true)
                return undefined

            const user = users.find(user => user.id === tokenData.id)

            if (!user || !user.confirmed)
                return undefined

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
