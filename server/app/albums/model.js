class Album {
    constructor(id, uid, name) {
        this.id = id++
        this.name = name
        this.owner = uid

        this.photos = []
    }

    static get = (id, uid, name) => {
        const album = albums.find((album) => album.id === id || album.name === name)

        if (album)
            return album

        const newAlbum = new Album(id, name, uid)
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
const albums = []

module.exports = {
    Album,
    albums,
}
