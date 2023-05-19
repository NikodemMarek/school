const {path_utils, root, move, remove} = require('./../fileController')

class Photo {
    constructor(name, url) {
        this.id = id++
        this.name = name
        this.url = url

        this.tags = []
        this.filters = []

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

// Tags api integration
Photo.prototype.addTag = function (tagId) {
    if (this.tags.includes(tagId)) return

    this.tags.push(tagId)

    this.history.push({
        status: `added tag with id ${tagId}`,
        timestamp: new Date(),
    })
}
Photo.prototype.removeTag = function (tagId) {
    this.tags = this.tags.filter(tag => tag !== tagId)

    this.history.push({
        status: `removed tag with id ${tagId}`,
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

Album.prototype.deletePhoto = function (id) {
    const initialLength = this.photos.length

    this.photos.filter(photo => photo.id === id).forEach(f => f.remove())
    this.photos = this.photos.filter(photo => photo.id !== id)

    return initialLength !== this.photos.length
}

let id = 0
let albums = []

module.exports = {
    Photo,
    Album,
    albums,
}
