const {path_utils, root, move, remove} = require('./../fileController')

class Photo {
    constructor(name, url) {
        this.id = id++
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
Photo.prototype.remove = async function () {
    remove(this.url)

    this.history.push({
        status: 'removed',
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

Album.prototype.getPhoto = function (id) {
    return this.photos.filter(photo => photo.id === id)
}
Album.prototype.deletePhoto = function (id) {
    this.photos.filter(photo => photo.id === id).forEach(f => f.remove())

    this.photos = this.photos.filter(photo => photo.id !== id)
}

let id = 0
let albums = []

module.exports = {
    Photo,
    Album,
    albums,
}
