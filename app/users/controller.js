const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, users } = require('./model')

const createToken = (email) => {
    if (!process.env.SECRET_KEY)
        throw 'internal_server_error';

    const token = jwt.sign(
        {
            email,
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

    const token = createToken(email);

    return token
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

    const token = createToken(email);

    return token
}

module.exports = {
    getUsers,
    register,
    login,
}
