import { objectToFormData, get, post } from '../data/api'

const getImageTags = async (id) =>
    await get(`/photos/${id}/tags`)

const tagImage = async (id, tagIds) =>
    await post(`/photos/${id}/tags`, objectToFormData({ tagIds: JSON.stringify(tagIds) })) 

const createTag = async (name) =>
    await post(`/tags`, objectToFormData({ name }))

export { getImageTags, tagImage, createTag }
