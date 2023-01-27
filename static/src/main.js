import Game from './game.js'
import Net from './net.js'
import UI from './ui.js'

const login = async () => {
    const username = await ui.login()

    await net.login(username)

    const player = await net.getPlayer()
    const game = await net.getGame()

    render = new Game([true, false][player.color], game.board).render
    render()
}

let {render} = new Game(false)
const net = new Net()
const ui = new UI()

render()

login().then(() => {
    console.log('logged in')
})
