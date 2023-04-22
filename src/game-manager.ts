import Board from './board'
import Loader from './loader'
import {Point, Tile, Virus} from './objects'
import ObjectsManager from './objects-manager'
import Scoreboard from './scoreboard'
import {Color} from './types'

class GameManager {
    private size: Point

    private timer

    private board: Board
    private manager: ObjectsManager

    private scoreboard: Scoreboard

    private toPop: Tile[] = []

    constructor(size: Point, loader: Loader) {
        this.size = size

        this.manager = new ObjectsManager(
            this.size,
            [],
            [],
            [this.newVirus(), this.newVirus(), this.newVirus()]
        )
        this.board = new Board(
            this.size,
            loader,
            this.manager.viruses.map(({ x, y }) => ({ x, y }))
        )

        document.addEventListener('keydown', ({key}) => {
            ;(() => {
                const move = {
                    a: new Point(-1, 0),
                    d: new Point(1, 0),
                    // w: new Point(0, -1),
                    s: new Point(0, 1),
                }[key]

                if (move)
                    return this.toPop.push(...this.manager.moveActivePill(move))

                const rotate = {
                    q: -1,
                    e: 1,
                    f: 2,
                }[key]

                if (rotate) return this.manager.rotateActivePill(rotate)
            })()

            this.refresh()
        })

        this.scoreboard = new Scoreboard(
            document.querySelector('#scoreboard') as HTMLDivElement
        )

        this.timer = setInterval(() => this.update(300), 300)
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

    private update = (delta: number) => {
        const viruses = this.manager.viruses.length

        this.toPop.push(...this.manager.update(new Point(0, 1)))
        this.board.update(delta)
        this.refresh()

        if (
            [
                ...this.manager.pills.map((pill) => pill.absTiles()).flat(),
                ...this.manager.tiles,
            ].some((tile) => tile.y === 0)
        )
            return this.gameOver(false)

        if (this.manager.viruses.length >= viruses) return

        const killed = viruses - this.manager.viruses.length
        this.scoreboard.addKills(killed)

        if (this.manager.viruses.length > 0) return

        this.gameOver(true)
    }

    private refresh = () => {
        this.board.refresh(
            this.manager.tiles,
            [this.manager.activePill, ...this.manager.pills],
            this.manager.viruses,
            this.toPop
        )

        this.toPop = []
    }

    private gameOver = (won: boolean) => {
        if (won) this.scoreboard.updateHighscore()

        clearInterval(this.timer)

        const overlay = document.querySelector('#overlay') as HTMLDivElement
        overlay.style.display = 'flex'
        overlay.innerHTML = won ? 'you won' : 'game over'
    }
}

export default GameManager
