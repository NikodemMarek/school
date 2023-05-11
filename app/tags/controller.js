const {tags, Tag, add} = require('./model')

const getAll = () => tags
const getRaw = () => tags.map(tag => tag.name)
const get = (id) => tags.find(tag => tag.id === id)

const post = (name) => add(name, 1)

module.exports = {
    getAll, getRaw, get,
    post,
}
