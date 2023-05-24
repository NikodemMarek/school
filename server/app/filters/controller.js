const sharp = require('sharp')

const {getImageById} = require('../images/controller')

const getMetadata = async (id) => {
    const photo = getImageById(id)

    try {
        return await sharp(photo.url).metadata()
    } catch (err) {
        throw 'metadata_not_available'
    }
}

const applyFilter = async (id, filter) => {
    const photo = getImageById(id)

    try {
        // TODO: apply filter
        return await sharp(photo.url).toBuffer()
    } catch (err) {
        throw 'filter_not_available'
    }
}

module.exports = {
    getMetadata,
    applyFilter
}
