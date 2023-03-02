const NodeHttpServer = require('./NodeHttpServer')

const server = new NodeHttpServer()

const io = require('socket.io')(server.server)

const users = []
io.on('connection', (socket) => {
    const sendRoomMgs = (room, user, message, type) =>
        io.to(room).emit('msg', {user, message, type})

    socket.on('join', ({room, username}) => {
        users.push({room, username, socketId: socket.id})
        socket.join(room)

        sendRoomMgs(room, username, `${username} joined the chat`, 'join')
    })

    socket.on('msg', ({room, user, message}) =>
        sendRoomMgs(room, user, message, 'msg')
    )

    socket.on('disconnect', () => {
        const user = users.find((user) => user.socketId === socket.id)
        if (!user) return

        sendRoomMgs(
            user.room,
            user.username,
            `${user.username} left the chat`,
            'leave'
        )

        users.splice(users.indexOf(user), 1)
    })
})

server.start()
