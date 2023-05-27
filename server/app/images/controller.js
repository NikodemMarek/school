const {albums, Album, Photo} = require('./model')
const { getTagById } = require('../tags/controller')

const getAll = () => JSON.parse(JSON.stringify(albums))
const getImageById = (id) => {
    for (const album of albums) {
        for (const photo of album.photos) {
            if (photo.id === id)
                return JSON.parse(JSON.stringify(photo))
        }
    }

    throw 'image_not_found'
}
const getMutableImage = (uid, id) => {
    for (const album of albums) {
        if (album.uid !== uid)
            continue

        for (const photo of album.photos) {
            if (photo.id === id)
                return photo
        }
    }

    throw 'image_not_found'
}

const addImagesToAlbum = async (uid, name, files) => {
    const photos = files.map(
        (file) => new Photo(
            file.originalName,
            file.path.replace(__dirname, '/'),
        )
    )

    const album = Album.get(uid, name)
    for (const photo of photos) {
        await album.addPhoto(photo)
    }

    return 'success'
}

const deleteImage = (uid, id) => {
    getMutableImage(uid, id).remove()

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

const patchImageTags = (uid, id, tagIds) => {
    const photo = getMutableImage(uid, id)

    for (const tagId of tagIds) {
        photo.addTag(tagId)
    }

    return 'success'
}

module.exports = {
    getAll, getImageById,
    addImagesToAlbum,
    deleteImage,
    // Tags api integration
    getImageTags,
    patchImageTags,
}
