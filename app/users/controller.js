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
const verifyToken = (token) => {
    if (!process.env.SECRET_KEY)
        throw 'internal_server_error';

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
    }
    catch (e) {
        throw 'invalid_token';
    }
}

const getUsers = () => users

const register = async (name, lastName, email, password) => {
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
