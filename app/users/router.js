const { handleRes, JSONResponse } = require('../helpers')

const { getUsers, register, confirmAccount, login } = require('./controller')

const router = (entry, server) => {
    server.get(`${entry}`, handleRes(getUsers))

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
}

module.exports = router
