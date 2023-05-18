const { handleRes } = require('../helpers')

const {getAll, get, post, remove, getTags, patchTags, patchTag} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getAll))
    server.get(`${entry}/:id`, async ({params: {id: rawId}}) => await handleRes(get, parseInt(rawId))())

    server.post(`${entry}`, async ({body: {albumName}, files}) => await handleRes(post, albumName, files)())

    server.delete(`${entry}/:id`, async ({params: {id: rawId}}) => await handleRes(remove, parseInt(rawId))())

    // Tags api integration

    server.get(`${entry}/:id/tags`, async ({params: {id}}) => await handleRes(getTags, parseInt(id))())

    server.patch(`${entry}/:id/tags`, async ({params: {id}, body: {tagIds}}) => {
        patchTags(parseInt(id), tagIds.slice(1, -1).split(',').map(tagId => parseInt(tagId)))

        return handleRes(get, parseInt(id))()
    })
    server.patch(`${entry}/:id/tag`, async ({params: {id}, body: {tagId}}) => {
        patchTag(parseInt(id), parseInt(tagId))

        return handleRes(get, parseInt(id))()
    })
}

module.exports = router
