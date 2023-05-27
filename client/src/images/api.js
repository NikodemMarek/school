import { post } from '../data/api'

const uploadImages = async (album, images) => {
    const formData = new FormData()

    formData.append('albumName', album)

    images.forEach(image => formData.append(image.name, image, image.path))

    return await post('/photos', formData)
}

export { uploadImages }
