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
    move(
        this.url,
        path_utils.join(
            root,
            newPath,
        )
    )

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

// Filters api integration
Photo.prototype.addFilter = function (filterId) {
    if (this.filters.includes(filterId)) return

    this.filters.push(filterId)

    this.history.push({
        status: `added filter with id ${filterId}`,
        timestamp: new Date(),
    })
}

class Album {
    constructor(id, name) {
        this.id = id
        this.name = name

        this.photos = []
    }

    static get = (id, name) => {
        const album = albums.find((album) => album.id === id && album.name === name)

        if (album) return album

        const newAlbum = new Album(id, name)
        albums.push(newAlbum)

        return newAlbum
    }
}

Album.prototype.addPhoto = async function (photo) {
    await photo.move(
        path_utils.join(
            '/uploads',
            this.name,
            photo.name,
        )
    )

    this.photos.push(photo)
}

let id = 0
let albums = [
    new Album(-1, 'profile_pictures'),
]

module.exports = {
    Photo,
    Album,
    albums,
}
