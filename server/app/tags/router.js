const { handleRes } = require('../helpers')

const {getAllTags, getRawTags, getTagById, addTag} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getAllTags))
    server.get(`${entry}/raw`, handleRes(getRawTags))
    server.get(`${entry}/:id`, ({params: {id}}) => handleRes(getTagById, parseInt(id))())

    server.post(`${entry}`, ({body: {name}}) => handleRes(addTag, name)())
}

module.exports = router
