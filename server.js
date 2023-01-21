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

app.listen(PORT, () => console.log(`listening on ${PORT}`))
