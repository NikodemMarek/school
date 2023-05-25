import { post } from './api'

const register = async (name, lastName, email, password) =>
    await post('/users/register', { name, lastName, email, password })


const login = async (email, password) =>
    await post('/users/login', { email, password })

export { register, login }
