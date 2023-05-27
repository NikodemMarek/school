const { handleRes, JSONResponse } = require('../helpers')

const { getUsers, getUser, register, confirmAccount, login, updateUser, updateProfilePicture } = require('./controller')

const router = (entry, server) => {
    // server.get(`${entry}/all`, handleRes(getUsers))
    server.get(`${entry}`, ({ uid }) => handleRes(getUser, uid)());

    server.post(`${entry}/register`, ({ body: { name, lastName, email, password } }) => handleRes(register, name, lastName, email, password)())
    server.get(`${entry}/confirm/:token`, async ({ params: { token } }) => await handleRes(confirmAccount, token)())

    server.post(`${entry}/login`, async ({ body: { email, password } }) => handleRes(login, email, password)())

    server.patch(`${entry}`, async ({ body: { name, lastName }, uid }) => await handleRes(updateUser, uid, name, lastName)())
}

module.exports = router
