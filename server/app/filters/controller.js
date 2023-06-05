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
            img = img.rotate(parseInt(angle))
        } else if (filter === 'resize') {
            const { width, height } = props
            img = img.resize(parseInt(width), parseInt(height))
        } else if (filter === 'crop') {
            const { width, height, left, top } = props
            img = img.extract({ width: parseInt(width), height: parseInt(height), left: parseInt(left), top: parseInt(top) })
        } else if (filter === 'grayscale') {
            img = img.grayscale()
        } else if (filter === 'negate') {
            img = img.negate()
        } else if (filter === 'flip') {
            img = img.flip()
        } else if (filter === 'flop') {
            img = img.flop()
        } else if (filter === 'tint') {
            const { r, g, b } = props
            img = img.tint({ r: parseInt(r), g: parseInt(g), b: parseInt(b) })
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
