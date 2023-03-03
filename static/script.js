const Message = ({user, message, time, type}) => {
    const isSelf = user === username

    return (
        <div
            className={`message${
                isSelf ? (type === 'msg' ? ' right' : ' left') : ' left'
            }`}
        >
            <div className='msg-user'>{user}</div>
            <div className={`msg-message ${isSelf ? 'self-' : ''}${type}-msg`}>
                {message}
            </div>
            <div className='msg-time'>{time.toLocaleTimeString()}</div>
        </div>
    )
}

const Chat = ({messages}) => (
    <div id='messages'>
        {messages.map((msg, key) => (
            <Message {...msg} key={key} />
        ))}
    </div>
)

const MessageBox = ({value, send}) => {
    const [message, setMessage] = React.useState(value || '')

    const sendTyped = () => {
        // if (message === '') return // uncomment to disable sending empty messages

        send(message)
        setMessage('')
    }

    return (
        <div id='msg-form'>
            <input
                id='new-msg'
                type='text'
                value={message}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') sendTyped()
                }}
                onChange={(e) => setMessage(e.target.value)}
                autoComplete='on'
                autoFocus='on'
            />
            <button id='send-msg' onClick={sendTyped}>
                Send
            </button>
        </div>
    )
}

const Whole = ({socket}) => {
    const [messages, setMessages] = React.useState([])

    const sendMsg = (msg) => {
        socket.emit('msg', {room, user: username, message: msg})
    }

    React.useEffect(() => {
        socket.on('msg', ({user, message, type}) => {
            setMessages((messages) => [
                ...messages,
                {user, message, time: new Date(), type},
            ])

            scrollTo(0, document.body.scrollHeight)
        })
    }, [])

    return (
        <div>
            <Chat messages={messages} />

            <MessageBox send={sendMsg} />
        </div>
    )
}

const room = 'room1'
const username = prompt('username')

const socket = io()
socket.emit('join', {room, username})

ReactDOM.render(<Whole socket={socket} />, document.body)
