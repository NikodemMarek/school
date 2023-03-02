;(async () => {
    const room = 'room1'
    const username = prompt('username')

    const msgContainer = document.querySelector('#messages')

    const createMsg = (user, message, time, type) => {
        const isSelf = user === username

        const msg = document.createElement('div')
        msg.classList.add('message')
        msg.classList.add(isSelf ? (type === 'msg' ? 'right' : 'left') : 'left')
        msg.innerHTML = `
            <div class="msg__user">${user}</div>
            <div class="msg__message ${
                isSelf ? 'self-' : ''
            }${type}-msg">${message}</div>
            <div class="msg__time">${time.toLocaleTimeString()}</div>
        `

        return msg
    }

    const socket = io()
    socket.emit('join', {room, username})

    const messageInput = document.querySelector('#new-msg')
    const sendTypedMsg = () => {
        const msg = messageInput.value
        // if (!msg) return // uncomment to disable sending empty messages

        socket.emit('msg', {room, user: username, message: msg})
        messageInput.value = ''
        messageInput.focus()
    }

    document.onkeyup = (e) => {
        if (e.key === 'Enter') sendTypedMsg()
    }
    document.querySelector('#send-msg').onclick = () => sendTypedMsg()

    socket.on('msg', ({user, message, type}) => {
        msgContainer.appendChild(createMsg(user, message, new Date(), type))

        scrollTo(0, document.body.scrollHeight)
    })
})()
