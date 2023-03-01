import Game from './game.js'
import Net from './net.js'
import UI from './ui.js'

const start = async () => {
    new Game(false, undefined, () => {})

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

    const sendMove = async (from, to) => {
        console.log('sent')
    }

    new Game(
        net.isWhite,
        game.board,
        net.isWhite === game.isWhiteTurn,
        () => {}
    )

    return

    const client = await io.connect()
    client.emit('join', {gameId: game.gameId, playerId: player.playerId})

    client.on('wait', () => {
        ui.loading(true)
    })

    client.on('turn', ({board, white}) => {
        if (white === [true, false][player.color]) {
            ui.loading(false)
            const game = new Game([true, false][player.color], board, sendMove)
            game.render()
        }
    })
}

const net = new Net()
const ui = new UI()

start().then(() => {
    console.log('logged in')
})
