const { handleRes } = require('../helpers')

const {getAll, getImageById, getAlbumById, addImagesToAlbum, deleteImage, getImageTags, patchImageTags} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getAll))
    server.get(`${entry}/:id`, async ({ params: { id } }) => await handleRes(getImageById, parseInt(id))())

    server.get(`${entry}/albums/:id`, async ({ params: { id } }) => await handleRes(getAlbumById, parseInt(id))())

    server.post(`${entry}`, async ({ files, uid }) => await handleRes(addImagesToAlbum, uid, files)())

    server.delete(`${entry}/:id`, async ({ params: { id }, uid }) => await handleRes(deleteImage, uid, parseInt(id))())

    // Tags api integration
    server.get(`${entry}/:id/tags`, ({ params: { id } }) => handleRes(getImageTags, parseInt(id))())

    server.patch(`${entry}/:id/tags`, ({ params: { id }, body: { tagIds }, uid }) => handleRes(patchImageTags, uid, parseInt(id), tagIds.slice(1, -1).split(',').map(tagId => parseInt(tagId)))())
}

module.exports = router
