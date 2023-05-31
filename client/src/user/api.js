import { objectToFormData, get, post, patch } from '../data/api'
import { getImage } from '../images/api'

const getUser = async (id) =>
    await get(`/users/${id}`)

const getUserProfile = async (id) => {
    const user = await getUser(id)
    const photo = user?.profilePicture ? await getImage(user?.profilePicture) : null

    return {
        ...user,
        profilePicture: photo?.url,
        id,
    }
}

const getUserProfiles = async () => {
    const users = await get('/users')

    for (const user of users) {
        user.profilePicture = user?.profilePicture ? await getImage(user?.profilePicture) : null
    }

    return users
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

export { getUser, getUserProfile, getUserProfiles, setUserData, setUserProfilePicture, register, login }
