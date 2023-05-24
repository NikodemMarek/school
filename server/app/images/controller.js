const {albums, Album, Photo} = require('./model')
const { getTagById } = require('../tags/controller')

const getAll = () => albums
const getImageById = (id) => {
    for (const album of albums) {
        for (const photo of album.photos) {
            if (photo.id === id) return photo
        }
    }

    throw 'photo_not_found'
}

const addImagesToAlbum = async (name, files) => {
    const photos = files.map(
        (file) => new Photo(file.originalName, file.path)
    )

    const album = Album.get(name)
    for (const photo of photos) {
        await album.addPhoto(photo)
    }

    return 'success'
}

const deleteImage = (id) => {
    albums.every(album => !album.deletePhoto(id))

    if (!albums.length) throw 'not_found'
    return 'success'
}

// Tags api integration

const getImageTags = (id) => {
    const tagIds = getImageById(id).tags

    try {
        return tagIds.map(tagId => getTagById(tagId))
    } catch (err) {
        throw 'unknown_tag'
    }
}

const patchImageTags = (id, tagIds) => {
    try {

    const photo = getImageById(id)

    for (const tagId of tagIds) {
        photo.addTag(tagId)
    }

    return 'success'
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    getAll, getImageById,
    addImagesToAlbum,
    deleteImage,
    // Tags api integration
    getImageTags,
    patchImageTags,
}
