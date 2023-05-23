const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, users } = require('./model')

const createToken = (id) => {
    const token = jwt.sign(
        {
            id,
        },
        process.env.SECRET_KEY,
        {
            expiresIn: "24h"
        }
    );

    return token;
}

const getUsers = () => users

const register = async (name, lastName, email, password) => {
    const exists = users.some(user => user.email === email);

    if (exists)
        throw 'user_already_exists';

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = new User(name, lastName, email, encryptedPassword);

    users.push(user);

    const token = createToken(user.id);

    return token
}
const confirmAccount = async (token) => {
    let id = null;

    try {
        const res = jwt.verify(token, process.env.SECRET_KEY);
        if (!res)
            throw 'invalid_token'

        id = res.id;
    } catch (e) {
        throw 'invalid_token'
    }

    const user = users.find(user => user.id === id);

    if (!user)
        throw 'user_not_found';

    user.confirmed = true;

    return "success";
}

const login = async (email, password) => {
    const user = users.find(user => user.email === email);

    if (!user) {
        throw 'user_not_found';
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw 'incorrect_password';
    }

    const token = createToken(user.id);

    return token
}

module.exports = {
    getUsers,
    register, confirmAccount,
    login,
}
