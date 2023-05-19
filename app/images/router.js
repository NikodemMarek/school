const { handleRes } = require('../helpers')

const {getAll, getImageById, addImagesToAlbum, deleteImage, getImageTags, patchImageTags, patchImageTag} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getAll))
    server.get(`${entry}/:id`, async ({params: {id: rawId}}) => await handleRes(getImageById, parseInt(rawId))())

    server.post(`${entry}`, async ({body: {albumName}, files}) => await handleRes(addImagesToAlbum, albumName, files)())

    server.delete(`${entry}/:id`, async ({params: {id: rawId}}) => await handleRes(deleteImage, parseInt(rawId))())

    // Tags api integration
    server.get(`${entry}/:id/tags`, ({params: {id}}) => handleRes(getImageTags, parseInt(id))())

    server.patch(`${entry}/:id/tags`, ({params: {id}, body: {tagIds}}) => handleRes(patchImageTags, parseInt(id), tagIds.slice(1, -1).split(',').map(tagId => parseInt(tagId)))())
}

module.exports = router
