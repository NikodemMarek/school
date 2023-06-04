const { handleRes } = require('../helpers')

const { getMetadata, applyFilter } = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}/:id`, async ({ params: { id } }) => await handleRes(getMetadata, parseInt(id))())

    server.post(`${entry}/:id`, async ({ params: { id }, body, uid }) => await handleRes(applyFilter, uid, parseInt(id), body.filter, body)())
}

module.exports = router
