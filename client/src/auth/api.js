import { objectToFormData, post } from '../data/api'

const register = async (name, lastName, email, password) =>
    await post('/users/register', objectToFormData({ name, lastName, email, password }))

const login = async (email, password) =>
    await post('/users/login', objectToFormData({ email, password }))

export { register, login }
