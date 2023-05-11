const {getAll, get, post, remove, getTags, patchTags, patchTag} = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, async () => ({
        body: JSON.stringify(getAll()),
        headers: {
            'Content-Type': 'application/json',
        },
    }))
    server.get(`${entry}/:id`, async ({params: {id: rawId}}) => ({
        body: JSON.stringify(get(parseInt(rawId))),
        headers: {
            'Content-Type': 'application/json',
        },
    }))

    server.post(`${entry}`, async ({body: {albumName}, files}) => ({
        body: JSON.stringify(await post(albumName, files)),
        headers: {
            'Content-Type': 'application/json',
        },
    }))

    server.delete(`${entry}/:id`, async ({params: {id: rawId}}) => {
        remove(parseInt(rawId))
        
        return {
            body: JSON.stringify({ msg: 'removed' }),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })

    // Tags api integration

    server.get(`${entry}/:id/tags`, async ({params: {id}}) => ({
        body: JSON.stringify(getTags(parseInt(id))),
        headers: {
            'Content-Type': 'application/json',
        },
    }))

    server.patch(`${entry}/:id/tags`, async ({params: {id}, body: {tagIds}}) => {
        patchTags(parseInt(id), tagIds.slice(1, -1).split(',').map(tagId => parseInt(tagId)))

        return {
            body: JSON.stringify(get(parseInt(id))),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
    server.patch(`${entry}/:id/tag`, async ({params: {id}, body: {tagId}}) => {
        patchTag(parseInt(id), parseInt(tagId))

        return {
            body: JSON.stringify(get(parseInt(id))),
            headers: {
                'Content-Type': 'application/json',
            },
        }
    })
}

module.exports = router
