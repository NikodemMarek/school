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
    server.get('/api/photos/:id', async ({urlParams: {id: rawId}}) => {
        const id = parseInt(rawId)
        const found = albums.map(album => album.getPhoto(id)).flat(Infinity)

        return {
            body: JSON.stringify(found),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
    server.delete('/api/photos/:id', async ({urlParams: {id: rawId}}) => {
        const id = parseInt(rawId)
        albums.map(album => album.deletePhoto(id))
        
        return {
            body: JSON.stringify({ msg: 'removed' }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
}

module.exports = router
