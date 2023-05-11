const {albums, Album, Photo} = require('./model')
const getTag = require('../tags/controller').get

const getAll = () => albums
const get = (id) => albums.map(album => album.getPhoto(id)).flat(Infinity)

const post = async (name, files) => {
    const photos = files.map(
        (file) => new Photo(file.originalName, file.path)
    )

    const album = Album.get(name)
    for (const photo of photos) {
        await album.addPhoto(photo)
    }

    return albums
}

const remove = (id) => {
    albums.map(album => album.deletePhoto(id))
    return albums
}

// Tags api integration

const getTags = (id) => {
    const tagIds = get(id).map(photo => photo.tags).flat(Infinity)
        .reduce((acc, tagId) => {
            if (acc.includes(tagId)) return acc
            acc.push(tagId)
            return acc
        }, [])
    return tagIds.map(tagId => getTag(tagId))
}

const patchTags = (id, tagIds) => {
    const photos = get(id)

    for (const photo of photos) {
        for (const tagId of tagIds) {
            photo.addTag(tagId)
        }
    }

    return "success"
}
const patchTag = (id, tagId) => patchTags(id, [tagId])

module.exports = {
    getAll, get,
    post,
    remove,
    // Tags api integration
    getTags,
    patchTags, patchTag,
}
