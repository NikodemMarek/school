const API_ENTRYPOINT = 'http://localhost:3000/api'

const prepareData = (data) => {
    const formData = new FormData()

    for (const key in data) {
        formData.append(key, data[key])
    }

    return formData
}

const get = async (url) => {
    const response = await fetch(url)
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

const post = async (endpoint, body) => {
    const response = await fetch(`${API_ENTRYPOINT}${endpoint}`, {
        method: 'POST',
        body: prepareData(body),
    })
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

const put = async (endpoint, body) => {
    const response = await fetch(`${API_ENTRYPOINT}${endpoint}`, {
        method: 'PUT',
        body: prepareData(body),
    })
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

export { get, post, put }
