const fs = require('fs').promises

const router = (server) => {
    server.get('/api', ({}) => ({
        body: 'Hello World',
        headers: {
            'Content-Type': 'text/plain',
        },
    }))
    server.post('/api/photos', async ({body, files}) => {
        console.log(body, files)

        return {
            body: 'uploaded',
            headers: {
                'Content-Type': 'text/plain',
            },
        }
    })
}

module.exports = router
