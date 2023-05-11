const {getAll, getRaw, get, post} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, () => ({
            body: JSON.stringify(getAll()),
            headers: {
                'Content-Type': 'application/json',
            },
    }))
    server.get(`${entry}/raw`, () => ({
            body: JSON.stringify(getRaw()),
            headers: {
                'Content-Type': 'application/json',
            },
    }))

    server.get(`${entry}/:id`, ({params: {id}}) => {
        const tag = get(parseInt(id))

        if (tag)
            return {
                body: JSON.stringify(tag),
                headers: {
                    'Content-Type': 'application/json',
                },
            }

        return {
            body: JSON.stringify({msg: 'not found'}),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })

    server.post(`${entry}`, ({body: {name}}) => ({
        body: JSON.stringify(post(name)),
        headers: {
            'Content-Type': 'application/json',
        },
    }))
}

module.exports = router
