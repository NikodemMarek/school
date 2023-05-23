const handleRes = (fn, ...params) => {
    return (async () => {
        try {
            return JSONResponse(200, await fn(...params))
        } catch (err) {
            return JSONResponse(500, {err})
        }
    })
}

const JSONResponse = (code, data, headers = {}) => ({
    code,
    body: JSON.stringify(data),
    headers: {
        'Content-Type': 'application/json',
        ...headers,
    },
})

module.exports = {
    handleRes,
    JSONResponse,
}
