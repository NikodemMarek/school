const {tags, Tag, add} = require('./model')

const getAll = () => tags
const getRaw = () => tags.map(tag => tag.name)
const get = (id) => {
    const tag = tags.find(tag => tag.id === id)

    if (!tag) throw 'not_found'
    return tag
}

const post = (name) => add(name, 1)

module.exports = {
    getAll, getRaw, get,
    post,
}
