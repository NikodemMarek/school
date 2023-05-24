const {tags, Tag, add} = require('./model')

const getAllTags = () => tags
const getRawTags = () => tags.map(tag => tag.name)
const getTagById = (id) => {
    const tag = tags.find(tag => tag.id === id)

    if (!tag) throw 'not_found'
    return tag
}

const addTag = (name) => add(name, 1)

module.exports = {
    getAllTags, getRawTags, getTagById,
    addTag,
}
