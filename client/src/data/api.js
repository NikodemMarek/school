const API_ENTRYPOINT = 'http://localhost:3000/api'

const objectToFormData = (data) => {
    const formData = new FormData()

    for (const key in data) {
        formData.append(key, data[key])
    }

    return formData
}

export { objectToFormData }

const get = async (endpoint) => {
    const response = await fetch(`${API_ENTRYPOINT}${endpoint}`, {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

const post = async (endpoint, body) => {
    const response = await fetch(`${API_ENTRYPOINT}${endpoint}`, {
        method: 'POST',
        body,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

const patch = async (endpoint, body) => {
    const response = await fetch(`${API_ENTRYPOINT}${endpoint}`, {
        method: 'PATCH',
        body,
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
    })
    const data = await response.json()

    if (!response.ok)
        throw data
        
    return data
}

export { get, post, patch }
