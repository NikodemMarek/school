const { handleRes, JSONResponse } = require('../helpers')

const { getUsers, getUser, register, confirmAccount, login, updateUser, updateProfilePicture } = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getUsers))
    server.get(`${entry}/:id`, async ({ params: { id } }) => await handleRes(getUser, parseInt(id))())

    server.post(`${entry}/register`, ({ body: { name, lastName, email, password } }) => handleRes(register, name, lastName, email, password)())
    server.get(`${entry}/confirm/:token`, async ({ params: { token } }) => await handleRes(confirmAccount, token)())

    server.post(`${entry}/login`, async ({ body: { email, password } }) => handleRes(login, email, password)())

    server.get(`${entry}/me`, ({ uid }) => handleRes(getUser, uid)());
    server.post(`${entry}/me/profile`, async ({ body: { name, lastName }, uid }) => await handleRes(updateUser, uid, name, lastName)())
    server.post(`${entry}/me/pic`, async ({ files, uid }) => await handleRes(updateProfilePicture, uid, files[0])())
}

module.exports = router
