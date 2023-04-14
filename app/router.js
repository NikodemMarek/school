const {albums, Album, Photo} = require('./model')

const router = (server) => {
    server.get('/api', ({}) => ({
        body: 'welcome to the api',
        headers: {
            'Content-Type': 'text/plain',
        },
    }))

    server.post('/api/photos', async ({body: {albumName}, files}) => {
        const photos = files.map(
            (file) => new Photo(file.originalName, file.path)
        )

        const album = Album.get(albumName)
        for (const photo of photos) {
            await album.addPhoto(photo)
        }

        return {
            body: JSON.stringify(albums),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
    server.get('/api/photos', async () => ({
        body: JSON.stringify(albums),
        headers: {
            'Content-Type': 'application/json',
        },
    }))
}

module.exports = router
