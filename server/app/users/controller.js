const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, users } = require('./model')
const { Album, Photo } = require('../images/model')

const createToken = (id, confirmation = false) => {
    const payload = confirmation ? {
        id,
        confirmation: true,
    } : {
        id,
    }

    const token = jwt.sign(
        payload,
        process.env.SECRET_KEY,
        {
            expiresIn: confirmation ? '1m' : '1d',
        }
    )

    return token
}

const getUsers = () => users.map(({ id, name, lastName, email, profilePicture }) => ({
    id,
    name,
    lastName,
    email,
    profilePicture,
}))
const getUserMutable = (id) => {
    const user = users.find(user => user.id === id)

    if (!user)
        throw 'user_not_found'

    return user
}
const getUser = (id) => {
    const user = getUserMutable(id)

    return {
        id: user.id,
        name: user.name,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
    }
}

const register = async (name, lastName, email, password) => {
    const exists = users.find(user => user.email === email)

    if (exists) {
        if (exists.confirmed)
            throw 'user_already_exists'

        return createToken(exists.id, true)
    }

    const encryptedPassword = await bcrypt.hash(password, 10)

    const user = new User(name, lastName, email, encryptedPassword)

    users.push(user)

    return createToken(user.id, true)
}
const confirmAccount = async (token) => {
    let id = null

    try {
        const res = jwt.verify(token, process.env.SECRET_KEY)

        if (!res || !res.confirmation)
            throw 'invalid_token'

        id = res.id
    } catch (e) {
        throw 'invalid_token'
    }

    getUserMutable(id).confirmed = true

    return 'success'
}

const login = async (email, password) => {
    const user = users.find(user => user.email === email)

    if (!user)
        throw 'user_not_found'

    if (!user.confirmed)
        throw 'user_not_confirmed'

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect)
        throw 'incorrect_password'

    const token = createToken(user.id)

    return token
}

const updateUser = (id, name, lastName) => {
    const user = getUserMutable(id)

    if (name)
        user.name = name

    if (lastName)
        user.lastName = lastName

    return 'success'
}
const updateProfilePicture = (id, file) => {
    const user = getUserMutable(id)

    const picture = new Photo(
        `${id}.jpg`,
        file.path.replace(__dirname, '/'),
    )

    Album
        .get(-1, 'profile_pictures')
        .addPhoto(picture)

    user.profilePicture = picture.id

    return 'success'
}

module.exports = {
    getUsers, getUserMutable, getUser,
    register, confirmAccount,
    login,
    updateUser, updateProfilePicture,
}
