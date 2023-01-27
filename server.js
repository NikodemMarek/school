const express = require('express')
const path = require('path')

const PORT = 3000
const app = express()

const games = []

const board = [
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [2, 0, 2, 0, 2, 0, 2, 0],
    [0, 2, 0, 2, 0, 2, 0, 2],
]

app.use(express.static('static'))
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.post('/login', (req, res) => {
    const {username} = req.body

    const openGames = games.filter(({players}) => players.length < 2)

    res.setHeader('Content-Type', 'application/json')

    if (openGames.length) {
        if (openGames[0].players[0].username === username) {
            res.status(400).send(
                JSON.stringify({
                    code: 'USERNAME_TAKEN',
                    error: 'Username already taken.',
                })
            )
            return
        }

        openGames[0].players.push({
            id: 1,
            username,
            color: 1,
        })

        res.send(
            JSON.stringify({
                gameId: openGames[0].id,
                playerId: 1,
            })
        )
        return
    }

    games.push({
        id: games.length,
        players: [
            {
                id: 0,
                username,
                color: 0,
            },
        ],
        board: JSON.parse(JSON.stringify(board)),
    })

    res.send(
        JSON.stringify({
            gameId: games.length - 1,
            playerId: 0,
        })
    )
})

app.get('/game/:gameId/info', (req, res) => {
    const {gameId} = req.params

    const game = games.find(({id}) => id === parseInt(gameId))

    res.setHeader('Content-Type', 'application/json')

    if (!game) {
        res.status(400).send(
            JSON.stringify({code: 'GAME_NOT_FOUND', error: 'Game not found.'})
        )
        return
    }

    res.send(
        JSON.stringify({
            gameId: game.id,
            players: game.players.map(({id, username, color}) => ({
                id,
                username,
                color,
            })),
            board: game.board,
        })
    )
})

app.get('/game/:gameId/player/:playerId/info', (req, res) => {
    const {gameId, playerId} = req.params

    const game = games.find(({id}) => id === parseInt(gameId))

    res.setHeader('Content-Type', 'application/json')

    if (!game) {
        res.status(400).send(
            JSON.stringify({code: 'GAME_NOT_FOUND', error: 'Game not found.'})
        )
        return
    }

    const player = game.players.find(({id}) => id === parseInt(playerId))

    if (!player) {
        res.status(400).send(
            JSON.stringify({
                code: 'PLAYER_NOT_FOUND',
                error: 'Player not found.',
            })
        )
        return
    }

    res.send(
        JSON.stringify({
            gameId: game.id,
            playerId: player.id,
            username: player.username,
            color: player.color,
        })
    )
})

app.listen(PORT, () => console.log(`listening on ${PORT}`))
