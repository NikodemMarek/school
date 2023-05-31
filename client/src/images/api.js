import { get, post, pathToAccessUrl } from '../data/api'

const getImage = async (imageId) => {
    const photo = await get(`/photos/${imageId}`)

    return {
        ...photo,
        url: pathToAccessUrl(photo.url)
    }
}

const getAlbum = async (albumId) => {
    const album = await get(`/photos/albums/${albumId}`)

    return {
        ...album,
        photos: album.photos.map(photo => ({
            ...photo,
            url: pathToAccessUrl(photo.url)
        }))
    }
}

const uploadImages = async (images) => {
    const formData = new FormData()

    images.forEach((image, index) => formData.append(`${index}-${image.name}`, image, image.path))

    return await post('/photos', formData)
}

export { getImage, getAlbum, uploadImages }
