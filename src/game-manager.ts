import Board from './board'
import {Point, Virus} from './objects'
import ObjectsManager from './objects-manager'
import Scoreboard from './scoreboard'
import {Color} from './types'

class GameManager {
    private size: Point

    private board: Board
    private manager: ObjectsManager

    private scoreboard: Scoreboard

    constructor(size: Point) {
        this.size = size

        const game = document.createElement('div')
        document.body.appendChild(game)

        this.board = new Board(this.size, game)
        this.manager = new ObjectsManager(
            this.size,
            [],
            [],
            [this.newVirus(), this.newVirus(), this.newVirus()]
        )

        document.addEventListener('keydown', ({key}) => {
            ;(() => {
                const move = {
                    a: new Point(-1, 0),
                    d: new Point(1, 0),
                    // w: new Point(0, -1),
                    s: new Point(0, 1),
                }[key]

                if (move) return this.manager.moveActivePill(move)

                const rotate = {
                    q: -1,
                    e: 1,
                    f: 2,
                }[key]

                if (rotate) return this.manager.rotateActivePill(rotate)
            })()

            this.refresh()
        })

        const scoreboard = document.createElement('div')
        document.body.appendChild(scoreboard)
        this.scoreboard = new Scoreboard(scoreboard)

        setInterval(this.update, 300)
    }

    private newVirus = () => {
        const colors = Object.values(Color)
        const color = colors[Math.floor(Math.random() * colors.length)]

        return new Virus(
            Math.floor(Math.random() * this.size.x),
            Math.floor((Math.random() * this.size.y * 2) / 3 + this.size.y / 3),
            color
        )
    }

    private update = () => {
        const viruses = this.manager.viruses.length

        this.manager.update(new Point(0, 1))
        this.refresh()

        if (this.manager.viruses.length >= viruses) return

        const killed = viruses - this.manager.viruses.length
        this.scoreboard.addKills(killed)

        if (this.manager.viruses.length > 0) return

        this.scoreboard.updateHighscore()
        alert('you won')
    }

    private refresh = () => {
        this.board.refresh(
            this.manager.tiles,
            [this.manager.activePill, ...this.manager.pills],
            this.manager.viruses
        )
    }
}

export default GameManager
