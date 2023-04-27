const {tags, Tag, add} = require('./model')

const router = (entry, server) => {
    server.get(`${entry}`, () => ({
            body: JSON.stringify(tags),
            headers: {
                'Content-Type': 'application/json',
            },
    }))
    server.get(`${entry}/raw`, () => ({
            body: JSON.stringify(tags.map(tag => tag.name)),
            headers: {
                'Content-Type': 'application/json',
            },
    }))

    server.get(`${entry}/:id`, ({params: {id}}) => {
        id = parseInt(id)

        const tag = tags.find(tag => tag.id === id)

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

    server.post(`${entry}`, ({body: {name}}) => {
        const tag = add(name, 1)

        return {
            body: JSON.stringify(tag),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
}

module.exports = router
