class Net {
    constructor() {
        this.id = null
        this.username = null
        this.isWhite = null
    }

    login = async (username) => {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
            }),
        })

        if (res.status !== 200) throw await res.json()

        const {id, isWhite} = await res.json()

        this.id = id
        this.username = username
        this.isWhite = isWhite

        return true
    }

    getPlayer = async () => {
        const res = await fetch(`/info?id=${this.id}`, {
            method: 'GET',
        })

        if (res.status !== 200) throw new Error(await res.json())

        return await res.json()
    }

    awaitOpponent = async () => {
        const res = await fetch(`/await`, {
            method: 'GET',
        })

        if (res.status !== 200) throw new Error(await res.json())

        return await res.json()
    }

    getGame = async () => {
        const res = await fetch(`/game`, {
            method: 'GET',
        })

        if (res.status !== 200) throw new Error(await res.json())

        return await res.json()
    }
}

export default Net
