const handleRes = (fn, ...params) => {
    return (async () => {
        try {
            return JSONResponse(200, await fn(...params))
        } catch (err) {
            return JSONResponse(500, {err})
        }
    })
}

const JSONResponse = (code, data) => ({
    code,
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
    },
})

module.exports = {
    handleRes,
    JSONResponse,
}
