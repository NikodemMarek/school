const { handleRes } = require('../helpers')

const { getMetadata, applyFilter } = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}/:id`, async ({ params: { id: rawId } }) => await handleRes(getMetadata, parseInt(rawId))())

    server.patch(`${entry}/:id`, async ({ params: { id: rawId }, body: { filter } }) => await handleRes(applyFilter, parseInt(rawId), filter)())
}

module.exports = router
