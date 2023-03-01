import Game from './game.js'
import Net from './net.js'
import UI from './ui.js'

const start = async () => {
    new Game(false, [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
    ])

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

    const {board, players, isWhiteTurn} = await net.getGame()
    ui.gameInfo(players, isWhiteTurn)

    const game = new Game(net.isWhite, board, (from, to) => {
        net.moveFromTo(from, to)
        ui.loading(true)
    })

    ui.loading(!net.isWhite)

    net.onTurn((from, to, isWhiteTurn) => {
        game.moveFromTo(from, to)
        if (isWhiteTurn === net.isWhite) ui.loading(false)
    })
}

const net = new Net()
const ui = new UI()

start().then(() => {
    console.log('logged in')
})
