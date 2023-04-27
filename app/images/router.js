const {albums, Album, Photo} = require('./model')

const router = (entry, server) => {
    server.get(`${entry}`, async () => ({
        body: JSON.stringify(albums),
        headers: {
            'Content-Type': 'application/json',
        },
    }))
    server.get(`${entry}/:id`, async ({params: {id: rawId}}) => {
        const id = parseInt(rawId)
        const found = albums.map(album => album.getPhoto(id)).flat(Infinity)

        return {
            body: JSON.stringify(found),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })

    server.post(`${entry}`, async ({body: {albumName}, files}) => {
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

    server.delete(`${entry}/:id`, async ({params: {id: rawId}}) => {
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
