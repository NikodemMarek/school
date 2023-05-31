import { objectToFormData, get, post, patch } from '../data/api'
import { getImage } from '../images/api'

const getUser = async () =>
    await get('/users/current')

const getUserProfile = async () => {
    const user = await getUser()
    const photo = user?.profilePicture ? await getImage(user?.profilePicture) : null

    return {
        name: user?.name,
        lastName: user?.lastName,
        email: user?.email,
        profilePicture: photo?.url,
    }
}

const setUserData = async (name, lastName) =>
    await post('/users/current/profile', objectToFormData({ name, lastName }))

const setUserProfilePicture = async (image) => {
    const formData = new FormData()
    formData.append(image.name, image, image.path)

    await post('/users/current/pic', formData)
}

const register = async (name, lastName, email, password) =>
    await post('/users/register', objectToFormData({ name, lastName, email, password }))

const login = async (email, password) =>
    await post('/users/login', objectToFormData({ email, password }))

export { getUser, getUserProfile, setUserData, setUserProfilePicture, register, login }
