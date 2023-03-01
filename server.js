const express = require('express')
const path = require('path')

const http = require('http')
const {Server} = require('socket.io')

const PORT = 3000
const app = express()

const server = http.createServer(app)
const io = new Server(server)

const isWhiteTurn = true
const players = []
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

    res.setHeader('Content-Type', 'application/json')

    if (players.length >= 2)
        return res.status(400).send(
            JSON.stringify({
                code: 'GAME_FULL',
                error: 'Game is full.',
            })
        )
    if (!username || players.find((player) => player.username === username))
        return res.status(400).send(
            JSON.stringify({
                code: 'USERNAME_TAKEN',
                error: 'Username already taken.',
            })
        )

    const player = {
        id: players.length,
        username,
        isWhite: players.length === 0,
    }

    players.push(player)
    res.send(JSON.stringify(player))
})

app.get('/await', async (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    const listen = setInterval(() => {
        if (players.length === 2) {
            clearInterval(listen)

            res.send(JSON.stringify(players))
        }
    }, 100)
})

app.get('/info', (req, res) => {
    const {id} = req.query

    const player = players.find((player) => player.id === id)

    if (!player)
        return res.status(400).send(
            JSON.stringify({
                code: 'PLAYER_NOT_FOUND',
                error: 'Player not found.',
            })
        )

    res.send(JSON.stringify(player))
})

app.get('/game', (req, res) => {
    res.setHeader('Content-Type', 'application/json')

    res.send(JSON.stringify({board, players, isWhiteTurn}))
})

io.on('connection', (socket) => {
    console.log('user connected')

    socket.on('disconnect', () => {
        console.log('user disconnected')
        // TODO: handle disconnect
    })

    socket.on('join', (data) => {
        socket.join(`game-${data.gameId}`)

        socket.to(`game-${data.gameId}`).emit('wait')
        socket.to(`game-${data.gameId}`).emit('turn', {
            board: games[data.gameId].board,
            white: true,
        })
    })

    socket.on('move', (data) => {
        console.log('move', data)
        // TODO: handle move
    })
})

server.listen(PORT, () => console.log(`listening on port ${PORT}`))
