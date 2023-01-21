class Net {
    constructor() {
        this.playerId = null
        this.gameId = null

        this.username = null
    }

    login = async (username) => {
        const res = await fetch('/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
            }),
        })

        if (res.status !== 200) return false

        const {gameId, playerId} = res.json

        this.playerId = playerId
        this.gameId = gameId

        return true
    }
}

export default Net
