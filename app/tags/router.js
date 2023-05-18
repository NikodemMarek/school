const { handleRes } = require('../helpers')

const {getAll, getRaw, get, post} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getAll))
    server.get(`${entry}/raw`, handleRes(getRaw))

    server.get(`${entry}/:id`, ({params: {id}}) => handleRes(get, parseInt(id))())

    server.post(`${entry}`, ({body: {name}}) => handleRes(post, name)())
}

module.exports = router
