const { handleRes, JSONResponse } = require('../helpers')

const { getUsers, getUser, register, confirmAccount, login, updateUser, updateProfilePicture } = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getUsers))
    server.get(`${entry}/:id`, ({ params: { id } }) => handleRes(getUser, parseInt(id))());

    server.post(`${entry}/register`, async ({ body: { name, lastName, email, password } }) => {
        try {
            const token = await register(name, lastName, email, password)

            return JSONResponse(201, token, {
                'Authorization': `Bearer ${token}`
            })
        } catch (e) {
            return JSONResponse(500, e)
        }
    })
    server.get(`${entry}/confirm/:token`, async ({ params: { token } }) => await handleRes(confirmAccount, token)())

    server.post(`${entry}/login`, async ({ body: { email, password } }) => {
        try {
            const token = await login(email, password)

            return JSONResponse(200, token, {
                'Authorization': `Bearer ${token}`
            })
        } catch (e) {
            return JSONResponse(500, e)
        }
    })

    server.patch(`${entry}/:id`, async ({ params: { id }, body: { name, lastName } }) => await handleRes(updateUser, parseInt(id), name, lastName)())
}

module.exports = router
