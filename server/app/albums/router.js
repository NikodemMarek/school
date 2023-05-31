const { handleRes } = require('../helpers')

const {getAlbumById} = require('../images/controller')

const router = (entry, server) => {
    server.get(`${entry}/:id`, async ({ params: { id } }) => await handleRes(getAlbumById, parseInt(id))())
}

module.exports = router
