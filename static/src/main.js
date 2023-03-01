import Game from './game.js'
import Net from './net.js'
import UI from './ui.js'

const start = async () => {
    new Game(false, undefined, false)

    do {
        try {
            const username = await ui.login()
            await net.login(username)
        } catch ({error}) {
            alert(error)
        }
    } while (net.id === null)

    ui.loading(true)
    await net.awaitOpponent()
    ui.loading(false)

    const game = await net.getGame()

    ui.gameInfo(game.players, game.isWhiteTurn)

    const client = await io.connect()
    client.emit('join')

    ui.loading(true)

    client.on('turn', ({board, white}) => {
        console.log(white, net.isWhite)
        if (white === net.isWhite) {
            ui.loading(false)
            new Game(net.isWhite, board, true, (board) => {
                new Game(net.isWhite, board, false)
                ui.loading(true)
                client.emit('move', {board})
            })
        }
    })
}

const net = new Net()
const ui = new UI()

start().then(() => {
    console.log('logged in')
})
