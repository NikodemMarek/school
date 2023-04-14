const {albums, Album, Photo} = require('./model')

const router = (server) => {
    server.get('/api', ({}) => ({
        body: 'Hello World',
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
                'Content-Type': 'text/plain',
            },
        }
    })
}

module.exports = router
