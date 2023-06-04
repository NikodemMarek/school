const sharp = require('sharp')

const {getImageById} = require('../images/controller')
const { addImagesToAlbum } = require('../images/controller')
const { path_utils } = require('../fileController')
const { root } = require('../fileController')

const getMetadata = async (id) => {
    const photo = getImageById(id)

    try {
        return await sharp(path_utils.join(root, photo.url)).metadata()
    } catch (err) {
        throw 'metadata_not_available'
    }
}

const applyFilter = async (uid, id, filter, props) => {
    const photo = getImageById(id)

    if (filter === 'metadata')
        return 'go away'

    try {
        let img = sharp(path_utils.join(root, photo.url))

        if (filter === 'rotate') {
            const { angle } = props

            console.log('rotate', angle)

            img = img.rotate(parseInt(angle))
        }

        await img.toFile(path_utils.join(root, 'uploads', 'filtered.jpg'))

        await addImagesToAlbum(uid, [{
            originalName: `filtered-${photo.name}`,
            path: '/uploads/filtered.jpg'
        }])

        return 'success'
    } catch (err) {
        console.log('err', err)
        throw 'filter_not_available'
    }
}

module.exports = {
    getMetadata,
    applyFilter
}
