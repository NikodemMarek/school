import Game from './game.js'
import Net from './net.js'
import UI from './ui.js'

const login = async () => {
    const username = await ui.login()

    console.log(username)
    const user = await net.login(username)

    console.log(user)
}

const {render} = new Game()
const net = new Net()
const ui = new UI()

render()

login()
