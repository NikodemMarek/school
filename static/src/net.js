class Net {
    constructor() {
        this.playerId = null
        this.gameId = null
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

        if (res.status !== 200) return false

        const {gameId, playerId} = await res.json()

        this.gameId = gameId
        this.playerId = playerId

        return true
    }

    getPlayer = async () => {
        const res = await fetch(
            `/game/${this.gameId}/player/${this.playerId}/info`,
            {
                method: 'GET',
            }
        )

        if (res.status !== 200) throw new Error(await res.json())

        return await res.json()
    }

    getGame = async () => {
        const res = await fetch(`/game/${this.gameId}/info`, {
            method: 'GET',
        })

        if (res.status !== 200) throw new Error(await res.json())

        return await res.json()
    }
}

export default Net
