const {path_utils, root, move} = require('./fileController')

class Photo {
    constructor(name, url) {
        this.id = Date.now()
        this.name = name
        this.url = url

        this.lastChange = 'original'
        this.history = [
            {
                status: 'original',
                timestamp: new Date(),
            },
        ]
    }
}

Photo.prototype.move = async function (newPath) {
    move(this.url, newPath)

    this.url = newPath
    this.history.push({
        status: 'moved',
        timestamp: new Date(),
    })
}

class Album {
    constructor(name) {
        this.id = Date.now()
        this.name = name

        this.photos = []
    }

    static get = (name) => {
        const album = albums.find((album) => album.name === name)

        if (album) return album

        const newAlbum = new Album(name)
        albums.push(newAlbum)

        return newAlbum
    }
}

Album.prototype.addPhoto = async function (photo) {
    await photo.move(
        path_utils.join(
            root,
            'uploads',
            'albums',
            this.name,
            path_utils.basename(photo.url)
        )
    )

    this.photos.push(photo)
}

let albums = []

module.exports = {
    Photo,
    Album,
    albums,
}
